
var render = function(v){
	var isPaused = false;
	var renderings = 0;
	var data = v.$data;
	
function fixCollisions(){
	var maxPadPos = (data.gameWid-data.padWid);
	if(data.botPos < 0){
		data.botPos = 0;
	}else if(data.botPos > maxPadPos){
		data.botPos = maxPadPos;
	}
	
	data.playerAtMaxLeft = false;
	data.playerAtMaxRight= false;
	if(data.playerPos < 0){
		data.playerPos = 0;
		data.playerAtMaxLeft = true;
		data.playerVx = 0;
	}else if(data.playerPos > maxPadPos){
		data.playerPos = maxPadPos;
		data.playerAtMaxRight = true;
		data.playerVx = 0;
	}//keep both pads within bounds   
	
	if(data.ballY<(data.padHei+1)){
		if(((data.ballX+data.ballSize) >= data.botPos) && (data.ballX <= (data.botPos+data.padWid))){
			data.ballVx += data.botAccx;
			data.ballVy = -data.ballVy;
			data.ballY = (data.padHei+1);
		}else if(data.ballY<0){
			data.playerScore++;
		}
	}else if((data.ballY+data.ballSize)> (data.gameHei-(data.padHei+1)) ){
		if(((data.ballX+data.ballSize) >= data.playerPos) && (data.ballX <= (data.playerPos+data.padWid))){
			data.ballVx += data.playerVx;
			data.ballVy = -data.ballVy;
			data.ballY = (data.gameHei-(data.padHei+1+data.ballSize));
			v.bot_predictDestination();
		}else if((data.ballY+data.ballSize)>data.gameHei){
			data.botScore++;
		}
	}
	
	if(data.ballX<0){
		data.ballX = 0;
		data.ballVx = -data.ballVx;
		v.bot_predictDestination();
		data.x = [];
	}else if((data.ballX+data.ballSize) > data.gameWid){
		data.ballX = (data.gameWid-data.ballSize);
		data.ballVx = -data.ballVx;
		v.bot_predictDestination();
		data.x = [];
	}
}
		
var state = function(){
	
	data.playerVx += data.playerAccx;
	data.playerPos += data.playerVx;

	if(!isPaused){
		data.ballX += data.ballVx;
		data.ballY += data.ballVy;
	}else if(data.server== "player"){
		if(!((data.playerVx>0 && data.playerAtMaxRight) || (data.playerVx<0 && data.playerAtMaxLeft))){
			data.ballX += data.playerVx;
		}
	}
	if(data.server == "bot"){
		data.ballX = (data.botPos+ ((data.padWid/2) - (data.ballSize/2) ));
	}
	
	fixCollisions();
	data.renderings = ++renderings;
	requestAnimationFrame(state);
}
state();
	
	return {
		pause : function(){
			isPaused = true;
		},
		play : function(){
			isPaused = false;
			if(!renderings){
				state();
			}
		}
	}
}



var game = new Vue({
	el: "#main-sub",
	data : {
		botScore: 0, playerScore:0,
		botPos: 50, playerPos: 50,
		playerVx: 0, maxBotAccx: 4.4,
		botAccxReduction : 0.5,
		playerAccx : 0, botAccx: 0,
		ballX : 250, ballY : 100,
		ballSize : 15,
		ballVx : 0, ballVy : 0,
		playerAtMaxLeft : false,
		playerAtMaxRight : false,
		padWid : 40, padHei : 8,
		gameHei : 0, gameWid : 0,
		isPaused : true,
		isBegun: false, server: "",
		game : function(){},
		renderings : 0,
		
		goals : [],
		predictedDestination : 0
	},
	mounted : function(){
		var el = document.getElementById("arena");
		this.gameHei = el.clientHeight;
		this.gameWid = el.clientWidth;

		this.botPos = this.playerPos = ((this.gameWid/2) - (this.padWid/2));
		this.ballX = (this.playerPos+ ((this.padWid/2) - (this.ballSize/2) ));
		this.ballY = this.predictedDestination = (el.clientHeight/2);

		this.game= render(this);

		console.log(JSON.stringify(this.$data)); 
	},
	methods : {
		pausePlay : function(){
			if(this.isBegun){
				this.isPaused = !this.isPaused;
				if(this.isPaused){
					this.game.pause();
				}else{
					this.game.play();
				}
				this.server = (this.server=="bot")? "bot" : "";
			}else{
				this.isBegun = true;
				this.isPaused = false;
				this.ballVy = 5;
				this.game.play();
			}
		},
		t_start_front : function(){
			var pvx = this.playerVx;
			if((this.server == "player" || (!this.isPaused)) && !this.playerAtMaxRight){
				this.playerAccx += 0.3;
			}
//			this.playerVx+=5;
//			this.playerAccx=0;
			if(this.playerAtMaxRight){
				this.playerVx = 0;
			}
		},
		t_start_back : function(){;
			var pvx = this.playerVx;
			if((this.server == "player" || (!this.isPaused)) && !this.playerAtMaxLeft){
				this.playerAccx -= 0.3;
			}
//			this.playerVx-=5;
//			this.playerAccx=0;
			if(this.playerAtMaxLeft){
				this.playerVx = 0;
			}
		},
		t_end : function(){
			this.playerVx = 0;
			this.playerAccx = 0;
		},

		predictDestination : function(){
			return ((this.gameWid-(this.playerPos+(this.padWid/2)) >= (this.gameWid/2))? this.gameWid : 0);
		},
		bot_releaseBall : function(isAtDestination){
			if(isAtDestination && this.server=="bot"){
				this.ballVy = 5;
				this.server = "";
			}
		},
		
		
		bot_predictDestination : function(){
			var inp = [ normalize("x", this.ballX), normalize("y", this.ballY), normalize("vx", this.ballVx),  normalize("vy", this.ballVy) ];
			this.predictedDestination = normalize("x", destination_bot.activate(inp), true);;
		},
		bot_aim : function(){
			var inp = [normalize("startX", this.ballX+(this.ballSize/2)), normalize("startVx", this.ballVx), normalize("endX", this.predictDestination()) ];
			var ans = target_bot.activate(inp)[0];
			return ans;
		}
	},
	watch : {
		playerScore: function(sc){
			this.pausePlay();
			this.ballY = (this.gameHei - (this.padHei+2+this.ballSize));
			this.ballX = (this.playerPos+ ((this.padWid/2) - (this.ballSize/2) ));
			this.ballVx = 0;
			this.ballVy = 5;
			this.goals.push(1); 
			this.server = "player";
			var g = this.goals, r = this.botAccxReduction;
			if(sc%4 == 0){
				this.botAccxReduction = (r<=0)? 0 : r-1 ;
			}
			if(g.length >= 2 && (g[g.length-1] == g[g.length-2])){
				this.maxBotAccx+=0.5;
			}
			
			
		},
		botScore : function(){
			this.ballY = (this.padHei+1);
			this.ballX = (this.botPos+ ((this.padWid/2) - (this.ballSize/2) ));
			this.ballVx = 0;
			this.ballVy = 0;
			this.playerAccx = 0;
			this.server = "bot";
			this.predictedDestination = this.predictDestination();
 			this.bot_releaseBall();
 			this.goals.push(0);
			var g = this.goals;
			if(g.length >= 2 && (g[g.length-1] == g[g.length-2])){
			this.maxBotAccx = (this.maxBotAccx-0.5 < 2)? 2 : this.maxBotAccx-this.botAccxReduction ; 
			}
		},
		renderings : function(){
			if(this.ballVy>0 || this.isPaused){return;}
			var val = this.predictedDestination;
			var botPos = (this.botPos + (this.padWid/2));
			var bp = this.botPos;
			var botAccx = this.botAccx, isClose = ((Math.abs(val-botPos) < 1)? true : false); 
			if(val > botPos){
				if(this.botAccx<0){
					botAccx = 0;
				}
				if(isClose){
					botAccx = 0;
				}else{ botAccx++; }
			}else{
				if(this.botAccx>0){
					botAccx = 0;
				}
				if(isClose){
					botAccx = 0;
				}else{ botAccx--; }
			}


			if(isClose && (this.ballY<=(this.padHei+7))){
				var rand = Math.random();
				botAccx = this.bot_aim();
				if(rand > 0.5){
					botAccx = 0;
				}
			}
			
			var tempAccx = (botAccx>this.maxBotAccx)? this.maxBotAccx : botAccx ;
			tempAccx = (tempAccx< (0-this.maxBotAccx))? (0-this.maxBotAccx) : tempAccx;
 			this.botAccx = tempAccx;
			this.botPos+=this.botAccx;
			
			if(this.botPos <0){
				this.botPos=0;
			}else if((this.botPos+this.padWid)>this.gameWid){
				this.botPos = (this.gameWid-this.padWid);
			}
			
			var isAtDestination = (Math.abs(val-botPos) <= (this.padWid/2));
			this.bot_releaseBall(isAtDestination);
		}
	}
});



function normalize(type, x, isRev){
	var isRev = Boolean(isRev);
	var func = (isRev)? norm_rev : norm;
	if(type == "vx" || type == "vy"){
		return func(x, -9,9);
	}
	if(type == "x"){
		return func(x, 0, 380);
	}
	if(type == "y"){
		return func(x, -7, 500);
	}
	
	if(type == "startX" || type == "endX"){
		return func(x, 0, 348);
	}
	if(type == "startVx"){
		return func(x, -6, 6);
	}
	function norm(val, min, max){
		return ((val-min) /  (max-min));
	}
	function norm_rev(val, min, max){
		return (( (val*max) - (val*min)) + min);
	}
}
function randChoice(arr){
	return arr[Math.floor(Math.random() *arr.length)];
}
function randInt(min, max, dec){
	var val = (Math.random() *((max-min)+1) +min )
	return (dec)? val : Math.floor(val);
}
function normalizer(val, min, max){
	return ((val-min)  (max-min));
}

function jstr(x, obj){
	var obj = (obj==undefined)? {} : obj ;
	var defaultObj = {newline : "\n", noJSON : false };
	for(var d in defaultObj){
		if(Object.keys(obj).indexOf(d) < 0){	obj[d] = defaultObj[d]; }
	}
	
	 var y = "";
	 if(!obj.noJSON){
		try { y = JSON.stringify(x);
		}catch(e){
			y =  func(x);
		}
	}else{ y = func(x); }
function func(x){
	y = "";
	for(var i in x){
		y+=(i+" : "+x+obj.newline);
	}
	return y;
}
 return y;
}
