var Model = (function(){

var activations = {
	logistic :"LOGISTIC",
	relu : "RELU",
	tanh : "TANH", // not working
	identity : "IDENTITY",
	hlim : "HLIM"
}
var costs = {
	cross_entropy : "CROSS_ENTROPY",
	mse : "MSE",
	binary : "BINARY"
}
var models = {}

var exposed = function(obj){
	this.id = (new Date).getTime();
	var model = this;
	this.layers = [];
	
	if(typeof obj=="object" && (String(obj.constructor).indexOf("rray")>-1)){
		obj = {
			layers : obj,
			activations : (function(){
				var ans = [];
				for(var o in obj){
					ans.push("tanh");
				}
				return ans;
			})(),
			biases : (function(){
				var ans = [];
				for(var o in obj){
					ans.push(0);
				}
				return ans;
			})()
		}
	}
	
	for(var l in obj.layers){
		this.layers.push(new synaptic.Layer(obj.layers[l]) );
		var activation =(function(){
			return synaptic.Neuron.squash[ activations[obj.activations[l].toLowerCase()] ];
		})();
//		console.log(activation)
		this.layers[l].set({
			squash: activation,
			bias: obj.biases[l]
		});
		if(Number(l)>0){
			this.layers[l-1].project(this.layers[l]);
//			console.log(obj.layers[l-1]+" -> projects -> "+obj.layers[l]);
		}
	}
	var inp = this.layers[0];
	var out = this.layers[this.layers.length-1];
	var hid = [];
	for(var i = 1; i<=(this.layers.length-2); i++){
		hid.push(this.layers[i])
	}
	this.network = new synaptic.Network({
		input: inp,
		hidden: hid,
		output: out
	});
	this.trainer = new synaptic.Trainer(this.network);
}
exposed.prototype = {
	activate : function(inp){
		var ans = this.network.activate(inp);
		return ans;
	},
	propagate : function(out, lr){
		this.network.propagate(lr, out);
	},
	train : function(trainingSet, obj){
		var settings = {
			rate: 0.1,
			iterations: 10000,
			error: 0.005,
			shuffle: true,
			log: 1000,
			cost: "cross_entropy"//synaptic.Trainer.cost.CROSS_ENTROPY
		};
		var obj = (obj==undefined)? {} : obj ;
		for(var o in obj){
//			settings[o] = obj[o];
		}
		settings.cost = synaptic.Trainer.cost[ costs[settings.cost.toLowerCase()] ];
		this.trainer.train(trainingSet, settings);
	}
}

return exposed;
})();


/*
USAGE -

METHOD 1 :

var bot = new Model({
	layers : [2,3,1],
	activations : ["tanh","tanh","logistic"],
	biases : [0,0,0]
});
for(var i=0; i<10000; i++){
	bot.activate([0,1]);
	bot.propagate([1], 0.1);
	
	bot.activate([1,0]);
	bot.propagate([1], 0.1);
	
	bot.activate([1,1]);
	bot.propagate([0], 0.1);
	
	bot.activate([0,0])
	bot.propagate([0], 0.1);
}
alert(bot.activate([1,1]));


METHOD 2 : 

var bot = new Model({
	layers : [2,3,1],
	activations : ["tanh","tanh","logistic"],
	biases : [0,0,0]
});
bot.train([
	{input : [0,1], output : [1]},
	{input : [1,0], output : [1]},
	{input : [1,1], output : [0]},
	{input : [0,0], output : [0]},
],  {
	iterations : 10000,
	error : 0.001,
	cost : "mse",
	rate : 0.05
});
alert(bot.activate([1,1]));

*/