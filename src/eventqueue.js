var eventqueue=[];
var running=false;

var fireEvent=function(){
	if (eventqueue.length===0) {
		running=false;
		return;
	}
	running=true;

	var task=eventqueue.pop();
	var func=task[0], opts=task[1], cb=task[2], context=task[3];

	if (func.length>1){
		func.call(context,opts,function(err,res,res2){
			cb&&cb(err,res,res2);
			setTimeout(fireEvent,0);
		});
	} else { //sync func
		func.call(context,opts);
		setTimeout(fireEvent,0);
	}
}

var queueTask=function(func,opts,cb,context) {
	eventqueue.unshift([func,opts,cb,context]);
	if (!running) setTimeout(fireEvent,0);
}
module.exports={queueTask:queueTask};