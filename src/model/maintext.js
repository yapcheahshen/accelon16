/* singleton of maintext */

var {store,action,getter,hasGetter,registerGetter,unregisterGetter}=require("../model");
var ksa=require("ksana-simple-api");
var textscene=require("../scenes/text");
var textRoute={id:'root', db:'dsl_jwn', nfile:1, index: 0 , scene: textscene };
var busy=false;//waiting for layout , prevent double click on next/prev button
var timer1;
var E=require("react-native").createElement;
var db_uti={};

var MultiTargetPopup=require("../menu/multitarget");

var AsyncStorage=require("react-native").AsyncStorage;

var getSegments=function(opts,cb){
	ksa.sibling({db:opts.db,nfile:opts.nfile},function(err,data){
		if(!err) {
			cb(data.sibling.map((s)=>data.nfile+"@"+s));
		}
		else console.error(err);
	});
}

AsyncStorage.getItem("db_uti",function(err,data){
	if (err) return;
	try {
		db_uti=JSON.parse(data||"{}");
	} catch (e) {
		console.log(e);
		db_uti=[];
	}	
});

var save_db_uti=function(){
	AsyncStorage.setItem("db_uti",JSON.stringify(db_uti));
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



var prevFile=function(route,navigator){
	var nfile=route.nfile;
	if (nfile===0) return;		
	var newroute=JSON.parse(JSON.stringify(route));
	newroute.nfile=nfile-1;
	newroute.scene=route.scene;
	newroute.title=newroute.nfile;
	//newroute.markups=getter("getMarkupByFile",{db:newroute.db,nfile:newroute.nfile});
	navigator.replace(newroute);		
}
var nextFile=function(route,navigator){
	var nfile=route.nfile;
	if (nfile+1>=route.filenames.length) return ;

	var newroute=JSON.parse(JSON.stringify(route));
	newroute.nfile=nfile+1;
	newroute.scene=route.scene;
	newroute.title=newroute.nfile;
	//newroute.markups=getter("getMarkupByFile",{db:newroute.db,nfile:newroute.nfile});
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
var resetMenu=function() {
	var selectedTab=getter("selectedTab");
	 //force unselect paragraph, not a good way
	if (!selectedTab) action("selectingParagraph",-1);
}
var vpos2pos=function(opts,cb) {
	ksa.vpos2uti(opts,function(err,res){
		cb({uti:res[0],pos:0});
	});
}
var maintext={
	init:function(cb){
		registerGetter("contents",getContents);
		registerGetter("segments",getSegments);
		registerGetter("db",this.getDB.bind(this));
		registerGetter("toc",getTOC);
		registerGetter("vpos2pos",vpos2pos);

		getDBFilenames(textRoute.db,function(filenames){
			textRoute.filenames=filenames;
			//textRoute.markups=getter("getMarkupByFile",{db:textRoute.db,nfile:textRoute.nfile});
			cb();
		});
		store.listen("pushText",this.pushText,this);
		store.listen("setTextTitle",this.setTextTitle,this);
		store.listen("setQ",this.setQ,this);

		store.listen("viewport",this.onViewport,this);

		store.listen("jumpmarkup",this.jumpmarkup,this);
		store.listen("jumptarget",this.jumptarget,this);
	}
	,jumpmarkup:function(mid){
		var m=getter("getMarkup",mid);
		if (!m) {
			console.error("markup not found "+mid);
		}
		action("pushText",m);		
	}
	,jumptarget:function(opts){
		opts=opts||{};
		var mid;
		if (typeof opts==="string") mid=opts
		else mid=opts.id;

		var m=getter("getMarkup",mid);
		if (!m) {
			console.error("markup not found "+mid);
		}
		if (typeof m.target==="string") {
			var target=getter("getMarkup",m.target);
			if (target) action("pushText",target);
		} else {
			var popup=E(MultiTargetPopup,{fromtext:m.text,items:m.target});
			action("showPopup",{popup,px:opts.x,py:opts.y});
		}
	}
	,onViewport:function(vp) {
		if (!vp)return;
		if (db_uti[vp.db]!==vp.uti) {
			db_uti[vp.db]=vp.uti;
			save_db_uti();
		}
	}
	,getDB:function(){
		var routes=this.navigator.getCurrentRoutes();
		var route=routes[routes.length-1];
		return route.db;
	}
	,finalize:function(){
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
	,setTextTitle:function(title){
		var routes=this.navigator.getCurrentRoutes();
		var route=routes[routes.length-1];
		route.title=title;
		action("refreshNav");
	}
	,pushText:function(opts){
		//TODO fetch filenames
		var navigator=this.navigator;
		var routes=navigator.getCurrentRoutes();
		var q=this.q;

		getDBFilenames(opts.db,function(filenames){
		//parse UTI , should move into ksana-simple-api
			var r=routes[routes.length-1],targetuti;
			var uti=opts.uti|| db_uti[opts.db] || opts.defaultuti ;
			var {sid,nfile}=parseUti(uti,filenames);

			if (isNaN(nfile)||nfile===-1) {
				console.warn("invalid uti"+opts.uti);
				return;
			}
			targetuti=nfile+"@"+sid;				


			if (routes.length>1 && r.db===opts.db && r.scene===textscene && r.nfile===nfile) {
				if (opts.replaceCamp && routes.length>1) {
					//let navigator resetTo 
				} else {
					scrollToUti(targetuti, r);
					return;					
				}
			}

			//var markups=getter("getMarkupByFile",{db:opts.db,nfile})||[];

			var route={q, db:opts.db,nfile:nfile,filenames:filenames
			, scrollTo:targetuti,s: opts.s , l:opts.l
			, index:routes.length, scene: textscene};

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
		resetMenu();
	}
	,rightButtonOnPress:function(route,navigator) {
		if (busy) return ;
		(route.index>0)?camp(route,navigator):nextFile(route,navigator);
		resetMenu();
	}
	,leftButtonText:function(route){
		return (route.index>0)?"← Back": ((route.nfile>0)?"↑Prev":"") ;

	}
	,rightButtonText:function(route){
		if (route.index>0) {
			return "△Camp";
		} else {
			if (!route.filenames)return;
			return (route.nfile+1<route.filenames.length)?"Next↓":"";
		}
	}
	,getTitle:function(route) {
		var position="";
		if (hasGetter("viewport")){
			var vp=getter("viewport");
			if (vp) position=(1+vp.start)+"/"+vp.max;
		}
		return (route.title||"text_unique_id") + "("+(position||"now/all")+")";
	}
	,initialRoute:textRoute
	,initialRouteStack:[textRoute]
}

module.exports=maintext;