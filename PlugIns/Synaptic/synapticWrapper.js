/*
	Custom made synaptic wrapper, to shorten code and save time.
	Synaptic.js has to be included in page before this code is run.
	
	Scroll to bottom for tutorial

*/

var Synaptic_AI = (function(){

	var Neuron = synaptic.Neuron,
		Layer = synaptic.Layer,
		Network = synaptic.Network,
		Trainer = synaptic.Trainer,
		Architect = synaptic.Architect;
	
	var instances = 0;
	
	function isLayersValid(inL, hidL, outL){
		var args = [inL, hidL, outL];
		for(var i in args){
			if(isNaN(args[i])){
				return false;
			}
		}
		return true;
	}//handles invalid layer values
	
	/* Regular AI mode */
	var AI = function(innerLayer, hiddenLayer, outerLayer){
		
		if(!isLayersValid(innerLayer, hiddenLayer, outerLayer)){ return null; }//in case of invalid layer values

		Network = synaptic.Network;
		/* Creates the layers and links them to the network */
		function Perceptron(inL, hidL, outL){
			var inputLayer = new Layer(inL);
			var hiddenLayer= new Layer(hidL);
			var outputLayer= new Layer(outL);
		
			inputLayer.project(hiddenLayer);
			hiddenLayer.project(outputLayer);
		
			this.set({
				input: inputLayer,
				hidden: [hiddenLayer],
				output: outputLayer
			});
		}
		Perceptron.prototype = new Network();
		Perceptron.prototype.constructor = Perceptron;
	
		this.settings = {
			rate: .1,
			iterations: 10000,
			error: .05,
			shuffle: true,
			log: 0,
			cost: Trainer.cost.CROSS_ENTROPY
		}//default settings
		
		this._Perceptron = new Perceptron(innerLayer, hiddenLayer, outerLayer);// <- This is the network
		this._Trainer = new Trainer(this._Perceptron);

		this.ID = instances++;// ID unique to each AI instance
	}
	
	AI.prototype = {
		train : function(trainingSet){
			var trained = this._Trainer.train(trainingSet, this.settings);
			return trained;
		},
		test : function(input){
			var answer = this._Perceptron.activate(input);
			return answer;
		}
	}
	
	var RogueAI = function(inputLayer, hiddenLayer, outputLayer){

		if(!isLayersValid(inputLayer, hiddenLayer, outputLayer)){ return null; }//in case of invalid layer values

		var inL = new Layer(inputLayer);
		var hidL= new Layer(hiddenLayer);
		var outL= new Layer(outputLayer);
		
		inL.project(hidL);
		hidL.project(outL);
		
		var myNetwork = new Network({
			input : inL,
			hidden : [hidL],
			output : outL
		});
		instances++;
		return myNetwork;
	}

	return function(a, b, c, useRogue){
		if(arguments.length > 3){
			if(useRogue){
				return RogueAI(a, b, c);
			}
		}
		return ( new AI(a, b, c) );
	}
})()

/*
	Tutorial : simple XOR network
	
	METHOD 1 :
	(step 1) var bot = Synaptic_AI( 2, 2, 1)
 	(step 2) var training_set = [
 	  { input : [0, 1], output : [0] },
 	  { input : [1, 0], output : [0] },
 	  { input : [1, 1], output : [1] },
 	  { input : [0, 0], output : [1]}
 	];

	(step 3) bot.settings.iterations = 2000;

	(step 4) bot.train(training_set);
	
	(step 5) var result =  bot.test([1, 0]);
	
	(step 6) alert( result );
	
	// ^ should alert 0. Approximately.
	
	Steps :
		1 : Creates a new, fully connected network instance. The three arguments are required, for the input layer, hidden layer and output layer

		2 : Defines a training set. Must be an array, where each item is an object containing the input and output.

		3 : (OPTIONAL) This modifies the default settings for the network. The modifyable properties are iterations, error, rate, shuffle, log, cost.

		4 : Trains the network, on the provided training data.

		5 : Tests the network, on a sample input.

		6 : (OPTIONAL) Alerts the result of step 5.

	
	
	METHOD 2 :
	var bot = Synaptic_AI(2, 2, 1);
	
	for(var i=0 ; i<2000; i++){
		bot.activate([0,0]);
		bot.propagate(learningRate, [0]);
	
		bot.activate([0,1]);
		bot.propagate(learningRate, [1]);
	
		bot.activate([1,0]);
		bot.propagate(learningRate, [1]);
	
		bot.activate([1,1]);
		bot.propagate(learningRate, [0]);
	}
	
	// test the network
	bot.activate([0,0]); //[0.015020775950893527]


//Converting Synaptic to and from JSON
	var myNetwork = AI._Perceptron;
	var exported = myNetwork.toJSON();
	var imported = Network.fromJSON(exported);
	var ans = synaptic.Network.fromJSON(imported);
	
*/