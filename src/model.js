/* action dispatcher */
var {queueTask}=require("./eventqueue");

var listeners=[];
var getters={};

var action=function(evt,opts,cb){
	for (var i=0;i<listeners.length;i+=1) {
		var listener=listeners[i];
		if (evt===listener[1]) {
			queueTask( listener[2], opts,cb  );
		}
	}
}

var getter=function(name,opts,cb){ // sync getter
	if (getters[name]) {
		return getters[name](opts,cb);
	} else {
		console.error("getter '"+name +"' not found");
	}
}

var registerGetter=function(name,cb){
	if (cb==null && name) delete getters[name];
	else getters[name]=cb;
}

var store={
	listen:function(event,cb,element){
		listeners.push([element,event,cb]);
	}
	,unlistenAll:function(element){
		listeners=listeners.filter(function(listener){
			return (listener[0]!==element) ;
		});
	}
}

module.exports={ action, store, getter, registerGetter};