const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(process.argv[2] || path.join(__dirname, 'index.js'), 'utf8');

function createGame() {
  let options, nextFrame;
  const context = {
    console,
    performance: { now: () => 0 },
    requestAnimationFrame: callback => { nextFrame = callback; },
    Vue: function(config) { options = config; return {}; }
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  const game = { ...options.data, gameWid: 10000, gameHei: 1000,
    playerPos: 1000, isPaused: false, isBegun: true };
  game.$data = game;
  for (const [name, method] of Object.entries(options.methods)) game[name] = method.bind(game);
  game.game = context.render(game);
  return {
    game,
    difficulty: context.calculateBotDifficulty,
    tick: time => nextFrame(time),
    score: who => { const key = who + 'Score'; game[key]++; options.watch[key].call(game, game[key]); }
  };
}
function close(actual, expected, label) {
  assert.ok(Math.abs(actual - expected) < 1e-8, `${label}: expected ${expected}, received ${actual}`);
}
const { difficulty } = createGame();
for (const [player, bot, baseline, speed] of [
  [0, 0, 264, 264], [1, 0, 268, 286], [0, 1, 264, 246],
  [4, 4, 280, 280], [4, 5, 280, 262], [8, 8, 296, 296],
  [10, 12, 304, 268], [14, 14, 320, 320], [15, 15, 324, 324],
  [16, 16, 324, 324], [25, 25, 324, 324], [50, 50, 324, 324],
  [100, 100, 324, 324], [0, 100, 264, 120], [100, 0, 324, 360]
]) {
  const actual = difficulty(player, bot);
  close(actual.baselineSpeed, baseline, `baseline at ${player}:${bot}`);
  close(actual.speed, speed, `speed at ${player}:${bot}`);
}
console.log('Starting difficulty, former 4/8-point bug, baseline cap, floor and maximum passed');

for (let player = 0; player <= 200; player++) {
  for (let bot = 0; bot <= 200; bot++) {
    const current = difficulty(player, bot);
    const playerScores = difficulty(player + 1, bot);
    const botScores = difficulty(player, bot + 1);
    assert.ok(current.speed >= 120 && current.speed <= 360);
    assert.ok(current.baselineSpeed >= 264 && current.baselineSpeed <= 324);
    assert.ok(current.predictionScale >= 0.75 && current.predictionScale <= 1);
    assert.ok(playerScores.speed >= current.speed && playerScores.predictionScale >= current.predictionScale);
    assert.ok(botScores.speed <= current.speed && botScores.predictionScale <= current.predictionScale);
    if (current.speed > 120 && current.speed < 360) {
      assert.ok(playerScores.speed > current.speed && botScores.speed < current.speed);
    }
  }
}
for (let points = 0; points <= 200; points++) {
  close(difficulty(points, points).speed, Math.min(264 + points * 4, 324), 'tied baseline');
}
console.log('40,401 score combinations: monotonic lead response and bounded speed/targeting passed');

function playSequence(sequence) {
  const instance = createGame();
  instance.game.t_start_front();
  for (const scorer of sequence) {
    instance.score(scorer);
    const { game } = instance;
    const expected = difficulty(game.playerScore, game.botScore);
    close(game.maxBotAccx * 60, expected.speed, 'score watcher speed');
    close(game.botAcc, expected.predictionScale, 'score watcher targeting');
    assert.equal(game.playerDirection, 1, 'score must preserve held input');
    assert.equal(game.playerSpeed, 360, 'difficulty must not change player speed');
    assert.ok(Math.abs(game.botAccx) <= game.maxBotAccx);
  }
  return instance.game;
}
const streaks = playSequence([...Array(12).fill('player'), ...Array(12).fill('bot')]);
const alternating = playSequence(Array.from({length: 24}, (_, i) => i % 2 ? 'bot' : 'player'));
close(streaks.maxBotAccx, alternating.maxBotAccx, 'same final score, different scoring order');
close(streaks.botAcc, alternating.botAcc, 'same targeting after catch-up');
console.log('Both score watchers, catch-up, scoring-order independence and held input passed');

for (const fps of [30, 60, 120, 144]) {
  const {game, score, tick} = createGame();
  game.t_start_front();
  for (let n = 1; n <= fps; n++) {
    if (n === Math.floor(fps / 2)) score('bot');
    tick(n * 1000 / fps);
  }
  close(game.playerPos, 1360, `held movement across a score at ${fps} fps`);
  game.t_start_back(); tick(1000 + 1000 / fps);
  close(game.playerPos, 1360 - 360 / fps, 'immediate reversal');
  game.t_end(); const stopped = game.playerPos; tick(1100);
  close(game.playerPos, stopped, 'release stops movement');
}
const edge = createGame();
edge.game.gameWid = 348; edge.game.playerPos = 308;
edge.game.t_start_front(); edge.tick(16); close(edge.game.playerPos, 308, 'right edge');
edge.game.t_start_back(); edge.tick(32); assert.ok(edge.game.playerPos < 308);
edge.game.isPaused = true; const paused = edge.game.playerPos; edge.tick(48);
close(edge.game.playerPos, paused, 'paused movement');
edge.game.server = 'player'; edge.tick(64); assert.ok(edge.game.playerPos < paused);
console.log('30–144 fps movement, boundary reversal, release, pause and player serve passed');
