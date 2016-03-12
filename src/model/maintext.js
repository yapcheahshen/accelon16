/* singleton of maintext */

var {store,action,getter,registerGetter,unregisterGetter}=require("../model");
var ksa=require("ksana-simple-api");
var textscene=require("../scenes/text");
var Markups=require("./samplemarkups");

var textRoute={id:'root', db:'dsl_jwn', nfile:1, index: 0 , scene: textscene ,markups:Markups[1]};
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
	ksa.fetch({db:opts.db,uti:opts.uti,q:opts.q,fields:"head",asMarkup:true},function(err,data){
		if (!err) cb(data)
		else console.error(err);
	});
}

var getDBFilenames=function(db,cb){
	ksa.open({db:db},function(err,db){
		if (err) {
			console.error(err);
		} else{

			cb(db.get("filenames"));
		}
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
	newroute.markups=Markups[newroute.nfile];
	navigator.replace(newroute);		
}
var nextFile=function(route,navigator){
	var nfile=route.nfile;
	if (nfile+1>=route.filenames.length) return ;

	var newroute=JSON.parse(JSON.stringify(route));
	newroute.nfile=nfile+1;
	newroute.scene=route.scene;
	newroute.title=newroute.nfile;
	newroute.markups=Markups[newroute.nfile];
	navigator.replace(newroute);
}
var camp=function(route,navigator){ //set temporary text as base text
	var r=JSON.parse(JSON.stringify(route));
	delete r.q; 
	r.scene=route.scene;
	r.index=0;
	textRoute=r;
	navigator.replacePrevious(r);
	setTimeout(navigator.pop,0);		
}

var parseUti=function(uti,filenames){
	var p=uti.lastIndexOf("@");
	var fn=uti.substr(0,p);
	var nfile=parseInt(fn);
	var sid=uti.substr(p+1);
	if (isNaN(parseInt(fn))){
		nfile=filenames.indexOf(fn);
	}
			
	return {nfile,sid};	
}

var scrollToUti=function(uti,route) {
	action("scrollToUti",{uti,route});
}

var getTOC=function(opts,cb) {
	ksa.toc({db:opts.db,vpos:opts.vpos,tocname:opts.tocname},function(err,toc){
		if (err) {
			console.error(err);
		} else {
			cb(toc);
		}
	});
}

var vpos2pos=function(opts,cb) {
	ksa.vpos2uti(opts,function(err,res){
		cb({uti:res[0],pos:0});
	});
}
var maintext={
	init:function(cb){
		registerGetter("content",getContent);
		registerGetter("contents",getContents);
		registerGetter("segments",getSegments);
		registerGetter("db",getDB);
		registerGetter("toc",getTOC);
		registerGetter("vpos2pos",vpos2pos);
		getDBFilenames(textRoute.db,function(filenames){
			textRoute.filenames=filenames;
			cb();
		});
		store.listen("pushText",this.pushText,this);
		store.listen("setQ",this.setQ,this);
	}
	,finalize:function(){
		unregisterGetter("content");
		unregisterGetter("contents");
		unregisterGetter("segments");
		unregisterGetter("db");
		unregisterGetter("toc");
		unregisterGetter("vpos2pos");
		store.unlistenAll(this);
	}
	,setQ:function(opts){
		this.q=opts.q;
	}
	,pushText:function(opts){
		//TODO fetch filenames
		var navigator=this.navigator;
		var routes=navigator.getCurrentRoutes();
		var q=this.q;

		getDBFilenames(opts.db,function(filenames){
		//parse UTI , should move into ksana-simple-api
			var {sid,nfile}=parseUti(opts.uti,filenames);
			var r=routes[routes.length-1];

			if (isNaN(nfile)||nfile===-1) {
				console.warn("invalid uti"+opts.uti);
				return;
			}
			var targetuti=nfile+"@"+sid;

			if (routes.length>1 && r.db===opts.db && r.scene===textscene && r.nfile===nfile) {
				if (opts.replaceCamp && routes.length>1) {
					//let navigator resetTo 
				} else {
					scrollToUti(targetuti, r);
					return;					
				}
			}			

			var markups=Markups[nfile]||{};

			if (opts.s>-1 && opts.l>0) {
				markups=JSON.parse(JSON.stringify(markups));
				if (!markups[targetuti]) {
					markups[targetuti]={};
				}
				markups[targetuti]["__flashhint__"]={s:opts.s,l:opts.l,type:"flashhint",ttl:3000};
			}

			var route={q, db:opts.db, s: opts.s , l:opts.l,
			filenames:filenames,markups,
			scrollTo:targetuti,nfile:nfile, index:routes.length, scene: textscene};

			if (opts.replace) {
				(routes.length===1)?navigator.push(route):navigator.replace(route);
			} else if (opts.replaceCamp) {
				route.index=0;
				navigator.resetTo(route);
			} else {
				navigator.push(route);
			}
		});
	}
	,leftButtonOnPress:function(route,navigator) {
		if (busy) return ;
		(route.index>0)?navigator.pop():prevFile(route,navigator);
	}
	,rightButtonOnPress:function(route,navigator) {
		if (busy) return ;
		(route.index>0)?camp(route,navigator):nextFile(route,navigator);
	}
	,leftButtonText:function(route){
		return (route.index>0)?"Back": ((route.nfile>0)?"Prev":"") ;

	}
	,rightButtonText:function(route){
		if (route.index>0) {
			return "Camp";
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