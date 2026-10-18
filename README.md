![Paddle Game Logo](PaddleGameLogo.png)
# Paddle Game

> Ping Pong in your browser

[Play on Cloudflare Pages](https://leigh-ola-paddle-game.pages.dev/).

Supports desktop and mobile. Hold either side of the screen to move, or use the left and right arrow keys. Click the play/pause control or press Space to pause and resume.

## Adaptive difficulty

Difficulty is recalculated after every point from the current scores:

- At a tie, the bot starts with a maximum movement speed of 264 arena pixels/second.
- Each point you score raises that baseline by 4 pixels/second, up to 324 after your first 15 points.
- Each point of your lead adds 18 pixels/second; each point of the bot's lead subtracts 18.
- The resulting speed is bounded between 120 and 360 pixels/second.
- The landing-position prediction multiplier rises with the resulting difficulty, from 0.75 to 1.0 (0.9 at the start). This is a targeting adjustment, not an accuracy percentage.
- The same score always produces the same difficulty, regardless of scoring streaks. Your paddle speed remains 360 pixels/second.

Run the scoring and movement regression checks with `node difficulty.test.cjs`.
