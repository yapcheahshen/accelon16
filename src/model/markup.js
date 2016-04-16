var {store,action,getter,registerGetter,unregisterGetter}=require("../model");
var AsyncStorage=require("react-native").AsyncStorage;

var defaultmarkups=[
	//{id:'m1',db:'dsl_jwn',uti:"1@義因文顯",s:9,l:4,type:'link' ,target:"m1t"}
	//,{id:'m6',db:'dsl_jwn',uti:"1@義因文顯", s:6,l:2,type:'synonym'}
	//,{id:'m2',db:'dsl_jwn',uti:"1@證信序",s:1,l:2,type:'synonym'}
	//,{id:'m3',db:'dsl_jwn',uti:"1@證信序",s:7,l:2,type:'synonym2'}
	//,{id:'m4',db:'dsl_jwn',uti:"1@證信序",s:18,l:3,type:'synonym2'}
	//,{id:'m5',db:'dsl_jwn',uti:"1@證信序",s:43,l:3,type:'synonym2'}
	//,{id:'m6',db:'dsl_jwn',uti:"2@即白佛言",s:3,l:2,type:'link',target:'m6t'}
	//,{id:'m6t',db:'dsl_jwn',uti:'3@發心降伏',s:10,l:2}
	//,{id:'m1t',db:'dsl_jwn',uti:"2@即白佛言",s:9,l:5,type:'linktarget',master:'m1'}
	//,{id:'m10',db:'dsl_jwn',uti:"1@證信序-2",s:2,l:2,type:'link',target:'m10t'}
	,{id:'m10t',db:'dsl_jwn',uti:"1@證信序-2",s:6,l:9,type:'linktarget',master:'m10',label:"如是",text:"釋義:不異為如、無非為是。"}
	,{id:'m11t',db:'dsl_jwn',uti:"1@如是我聞-1",s:0,l:25,type:'linktarget',label:"如是",text:"釋義:如如不動...當下即是。"}	
	,{id:'m12t',db:'dsl_jwn',uti:"2@標宗-1",s:7,l:42,type:'linktarget',label:"如是",text:"解釋(舊說1):指下文滅度一切眾生..."}	
	,{id:'m13t',db:'dsl_jwn',uti:"2@標宗-1",s:56,l:27,type:'linktarget',label:"如是",text:"解釋(舊說2):提發起序中世尊著衣持缽..."}
	,{id:'m14t',db:'dsl_jwn',uti:"2@標宗-2",s:7,l:16,type:'linktarget',label:"如是",text:"解釋(今說):剋指上文善護念..."}
];

var markups=[];

var sampleMarkup=function(){
	markups=defaultmarkups;
	var affectedDB={};
	markups.forEach(function(m){affectedDB[m.db]=true});
	action("markupChanged",affectedDB); //deferlistview did not update when only markup is changed
	saveMarkup();
}
var resetMarkup=function(){
	markups=[];
	var affectedDB={};
	action("markupChanged",{}); //deferlistview did not update when only markup is changed
	saveMarkup();
}
AsyncStorage.getItem("markups",function(err,data){
	if (err) return;
	try {
		markups=JSON.parse(data||"[]");
	} catch (e) {
		console.log(e);
		markups=[];
	}
	buildIndex();
});

var mindex={};
var buildIndex=function(){
	mindex={};
	for (var i=0;i<markups.length;i+=1) {
		var m=markups[i];
		if (m) mindex[m.id]=i;
	}
}


var getByFile=function(opts){
	var out=[];
	for (var i=0;i<markups.length;i+=1) {
		var m=markups[i];
		if (!m) continue;
		if (parseInt(m.uti)===opts.nfile){
			out.push(m);
		} 
	}
	return out;
}

var get=function(opts){
	var i=mindex[opts];
	if (i>-1) return markups[i];
}
var listAll=function(){
	var db=getter("db");
	return markups.filter(function(m){return m.db===db});
}
var list=function(label,type){
	if (!label&&!type) {
		return listAll();
	}
	var out=[];
	for (var i=0;i<markups.length;i++){
		var m=markups[i];
		if (!m) continue;
		if (label&&type) {
			if (label===m.label && type===m.type) out.push(m);
		} else if (label) {
			if (label===m.label) out.push(m);
		} else if (type) {
			if (type===m.type) out.push(m);
		}
	}
	return out;
}
var uniqueid=function(){
	return 'm'+(Math.random()*10000000).toFixed();
}

var saveMarkup=function(){
	AsyncStorage.setItem("markups",JSON.stringify(markups));
}
var add=function(opts) {
	var member=opts.member;
	var affectedDB={};
	var M=member.map(function(m){
		affectedDB[m.db]=true;
		return {id:uniqueid(), db:m.db,uti:m.uti,
		type:"link",label:opts.label, s:m.s, l:m.l, text:m.text
	}});
	
	if (M.length>2) {
		M[0].target= M.map(function(m){return m.id});
		M[0].target.shift();
	} else {
		if (M.length===2) M[0].target=M[1].id;
	}

	if (M.length>1) for (var i=1;i<M.length;i+=1) {
		M[i].type="linktarget";
		M[i].target=M[0].id;
	}
	markups=markups.concat(M);
	buildIndex();
	saveMarkup();
	action("markupChanged",affectedDB);
}

store.listen("resetMarkup",resetMarkup);

store.listen("sampleMarkup",sampleMarkup);

registerGetter("getMarkup",get);
registerGetter("listMarkup",list);
registerGetter("getMarkupByFile",getByFile);
module.exports={getByFile,get,add};