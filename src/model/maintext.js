/* singleton of maintext */

var {store,action,getter,registerGetter,unregisterGetter}=require("../model");
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
	ksa.fetch({db:opts.db,uti:opts.uti,q:opts.q},function(err,data){
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

var prevFile=function(route,navigator){
	var nfile=route.nfile;
	if (nfile===0) return;		
	var newroute=JSON.parse(JSON.stringify(route));
	newroute.nfile=nfile-1;
	newroute.scene=route.scene;
	newroute.title=newroute.nfile;
	navigator.replace(newroute);		
}
var nextFile=function(route,navigator){
	var nfile=route.nfile;
	if (nfile+1>=route.filenames.length) return ;

	var newroute=JSON.parse(JSON.stringify(route));
	newroute.nfile=nfile+1;
	newroute.scene=route.scene;
	newroute.title=newroute.nfile;
	navigator.replace(newroute);
}
var rebase=function(route,navigator){ //set temporary text as base text
	var r=JSON.parse(JSON.stringify(route));
	delete r.q; 
	r.scene=route.scene;
	navigator.replacePrevious(r);
	setTimeout(navigator.pop,0);		
}
var maintext={
	init:function(cb){
		registerGetter("content",getContent);
		registerGetter("contents",getContents);
		registerGetter("segments",getSegments);
		registerGetter("db",getDB);
		getDBFilenames(textRoute.db,cb);
		store.listen("gotoTemp",this.gotoTemp,this);
		store.listen("setQ",this.setQ,this);
	}
	,finalize:function(){
		unregisterGetter("content");
		unregisterGetter("contents");
		unregisterGetter("segments");
		unregisterGetter("db");
		store.unlistenAll(this);
	}
	,setQ:function(opts){
		this.q=opts.q;
	}
	,gotoTemp:function(opts){
		//get file from uti, and scroll to it
		var p=opts.uti.lastIndexOf("@");
		var fn=opts.uti.substr(0,p);
		var sid=opts.uti.substr(p+1);
		var navigator=this.navigator;

		var nfile=textRoute.filenames.indexOf(fn);

		var routes=navigator.getCurrentRoutes();
		var route={db:opts.db||textRoute.db, q: this.q,
			filenames:textRoute.filenames,
			scrollTo:nfile+"@"+sid,nfile:nfile, index:routes.length  , scene: textscene};

		(routes.length===1)?navigator.push(route):navigator.replace(route);

	}
	,leftButtonOnPress:function(route,navigator) {
		if (busy) return ;
		(route.index>0)?navigator.pop():prevFile(route,navigator);
	}
	,rightButtonOnPress:function(route,navigator) {
		if (busy) return ;
		(route.index>0)?rebase(route,navigator):nextFile(route,navigator);
	}
	,leftButtonText:function(route){
		return (route.index>0)?"Back": ((route.nfile>0)?"Prev":"") ;

	}
	,rightButtonText:function(route){
		if (route.index>0) {
			return "Rebase";
		} else {
			if (!route.filenames)return;
			return (route.nfile+1<route.filenames.length)?"Next":"";
		}
	}
	,getTitle:function(route) {
		if (!route.filenames)return;
		return route.filenames[route.nfile];
	}
	,initialRoute:textRoute
	,initialRouteStack:[textRoute]
}

module.exports=maintext;