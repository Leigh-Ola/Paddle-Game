
var rawNetwork_destination = {"neurons":[{"trace":{"elegibility":{},"extended":{}},"state":0,"old":0,"activation":0,"bias":0,"layer":"input","squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":0,"old":0,"activation":0.1203155818540434,"bias":0,"layer":"input","squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":0,"old":0,"activation":0.6111111111111112,"bias":0,"layer":"input","squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":0,"old":0,"activation":0.2222222222222222,"bias":0,"layer":"input","squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":2.03525109042996,"old":2.03525109042996,"activation":0.8844488190190398,"bias":-1.2562557335178275,"layer":0,"squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":-2.8594735263831668,"old":-2.8594735263831668,"activation":0.054193679461674485,"bias":-2.151916545782845,"layer":0,"squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":1.2078087829224289,"old":1.2078087829224289,"activation":0.7699110088161704,"bias":-2.3729632913892655,"layer":0,"squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":-0.21686454576993666,"old":-0.21686454576993666,"activation":0.4459953520970427,"bias":-1.5362927920286453,"layer":0,"squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":2.1477420555338242,"old":2.1477420555338242,"activation":0.8954575919253998,"bias":3.9945382924038846,"layer":0,"squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":-2.796282870378974,"old":-2.796282870378974,"activation":0.05752537341140179,"bias":5.72391340673618,"layer":"output","squash":"LOGISTIC"}],"connections":[{"from":0,"to":4,"weight":3.573658142427366,"gater":null},{"from":0,"to":5,"weight":-0.30666431861590054,"gater":null},{"from":0,"to":6,"weight":-0.427901894346856,"gater":null},{"from":0,"to":7,"weight":-0.7422036320430244,"gater":null},{"from":0,"to":8,"weight":-1.5393236715324425,"gater":null},{"from":1,"to":4,"weight":1.286902634416936,"gater":null},{"from":1,"to":5,"weight":3.3729408853847294,"gater":null},{"from":1,"to":6,"weight":3.2367192579977258,"gater":null},{"from":1,"to":7,"weight":3.1363418106543626,"gater":null},{"from":1,"to":8,"weight":-2.1920644820151423,"gater":null},{"from":2,"to":4,"weight":1.601835799194578,"gater":null},{"from":2,"to":5,"weight":-3.512858647876938,"gater":null},{"from":2,"to":6,"weight":3.278965597936244,"gater":null},{"from":2,"to":7,"weight":1.9442357391393468,"gater":null},{"from":2,"to":8,"weight":0.9208391226177406,"gater":null},{"from":3,"to":4,"weight":9.709977283357766,"gater":null},{"from":3,"to":5,"weight":4.650176815630532,"gater":null},{"from":3,"to":6,"weight":5.343894016369125,"gater":null},{"from":3,"to":7,"weight":-1.1072997287582116,"gater":null},{"from":3,"to":8,"weight":-9.656062841845507,"gater":null},{"from":4,"to":9,"weight":10.236936332898697,"gater":null},{"from":5,"to":9,"weight":-21.84754281769703,"gater":null},{"from":6,"to":9,"weight":-14.455136257001376,"gater":null},{"from":7,"to":9,"weight":16.718659643105525,"gater":null},{"from":8,"to":9,"weight":-14.202258002193426,"gater":null}]}


var destination_bot = synaptic.Network.fromJSON(rawNetwork_destination);

