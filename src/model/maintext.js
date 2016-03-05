/* singleton of maintext */

var {store,action,getter,registerGetter}=require("../model");
var ksa=require("ksana-simple-api");
var textscene=require("../scenes/text");
var textRoute={db:'dsl_jwn', nfile:1, index: 0 , scene: textscene};
var busy=false;//waiting for layout , prevent double click on next/prev button
var timer1;

var getSegments=function(opts,cb){
	ksa.sibling({db:opts.db,nfile:opts.nfile},function(err,data){
		if(!err) {
			cb(data.sibling.map((s)=>data.nfile+"@"+s));
		}
		else console.error(err);
	});
}

var getContent=function(opts,cb){
	clearTimeout(timer1);
	busy=true;
	timer1=setTimeout(function(){
		busy=false;
	},300);
	ksa.fetch({db:opts.db,uti:opts.uti,q:opts.q},function(err,data){
		if (!err) cb(data[0].text);
		else console.error(err);
	});
}

var getContents=function(opts,cb){
	clearTimeout(timer1);
	busy=true;
	timer1=setTimeout(function(){
		busy=false;
	},300);
	ksa.fetch({db:opts.db,uti:opts.uti},function(err,data){
		if (!err) cb(data)
		else console.error(err);
	});
}

var getDBFilenames=function(db,cb){
	ksa.open({db:db},function(err,db){
		textRoute.filenames=db.get("filenames");
		cb();
	});
}

var getDB=function(){
	return textRoute.db;
}

var maintext={
	init:function(cb){
		registerGetter("content",getContent);
		registerGetter("contents",getContents);
		registerGetter("segments",getSegments);
		registerGetter("db",getDB);
		getDBFilenames(textRoute.db,cb);
	}
	,leftButtonOnPress:function(route,navigator) {
		if (busy) return ;
		var nfile=route.nfile;
		if (nfile===0) return;

		var newroute=JSON.parse(JSON.stringify(route));
		newroute.nfile=nfile-1;
		newroute.scene=route.scene;
		newroute.title=newroute.nfile;
		navigator.replace(newroute);
	}
	,rightButtonOnPress:function(route,navigator) {
		if (busy) return ;
		var nfile=route.nfile;
		if (nfile+1>=route.filenames.length) return ;

		var newroute=JSON.parse(JSON.stringify(route));
		newroute.nfile=nfile+1;
		newroute.scene=route.scene;
		newroute.title=newroute.nfile;
		navigator.replace(newroute);
	}
	,leftButtonText:function(route){
		return (route.nfile>0)?"Prev":"";
	}
	,rightButtonText:function(route){
		if (!route.filenames)return;
		return (route.nfile+1<route.filenames.length)?"Next":"";
	}
	,getTitle:function(route) {
		if (!route.filenames)return;
		return route.filenames[route.nfile];
	}
	,initialRoute:textRoute
}

module.exports=maintext;