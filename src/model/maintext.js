/* singleton of maintext */

var {store,action,getter,registerGetter}=require("../model");
var ksa=require("ksana-simple-api");
var textscene=require("../scenes/text");
var textRoute={title: 'x', db:'ds',  uti:'1@0', index: 0};
var getSegments=function(opts,cb){
	ksa.sibling({db:opts.db,uti:opts.uti},function(err,data){
		if(!err) {
			cb(data.sibling.map((s)=>data.nfile+"@"+s));
		}
		else console.error(err);
	});
}

var getContent=function(opts,cb){
	ksa.fetch({db:opts.db,uti:opts.uti},function(err,data){
		if (!err) cb(data[0].text);
		else console.error(err);
	});
}

var maintext={
	init:function(){
		registerGetter("content",getContent);
		registerGetter("segments",getSegments);
	}
	,scene:textscene
	,initialRoute:textRoute
}

module.exports=maintext;