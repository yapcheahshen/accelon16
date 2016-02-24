/* action dispatcher */
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
var ee = new EventEmitter();
var listeners=[];
var getters={};
var action=function(evt,p1,p2,p3){
	ee.emit(evt,p1,p2,p3);
}
 
var getter=function(name,p1,p2,p3){ // immediate getter
	if (getters[name]) {
		return getters[name](p1,p2,p3);
	} else {
		console.error("getter",name,"not found");
	}
}

var registerGetter=function(name,cb){
	if (cb==null && name) delete getters[name];
	else getters[name]=cb;
}

var store={
	listen:function(event,cb,element){
		ee.addListener(event,cb);
		listeners.push([element,event,cb]);
	}
	,unlistenAll:function(element){
		listeners=listeners.filter(function(listener){
			if (listener[0]===element) {
				ee.removeListener(listener[1],listener[2]);
				return false;
			}
			return true;
		});
	}
}

module.exports={ action, store, getter, registerGetter};