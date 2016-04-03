var {store,action,getter,registerGetter,unregisterGetter}=require("../model");

var markups=[


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
	{id:'m10t',db:'dsl_jwn',uti:"1@證信序-2",s:6,l:9,type:'linktarget',master:'m10',text:"如是",label:"釋義:不異為如、無非為是。"}
	,{id:'m11t',db:'dsl_jwn',uti:"1@如是我聞-1",s:0,l:25,type:'linktarget',text:"如是",label:"釋義:如如不動...當下即是。"}	
	,{id:'m12t',db:'dsl_jwn',uti:"2@標宗-1",s:7,l:42,type:'linktarget',text:"如是",label:"解釋(舊說1):指下文滅度一切眾生..."}	
	,{id:'m13t',db:'dsl_jwn',uti:"2@標宗-1",s:56,l:27,type:'linktarget',text:"如是",label:"解釋(舊說2):提發起序中世尊著衣持缽..."}
	,{id:'m14t',db:'dsl_jwn',uti:"2@標宗-2",s:7,l:16,type:'linktarget',text:"如是",label:"解釋(今說):剋指上文善護念..."}
];

var mindex={};
var buildIndex=function(){
	mindex={};
	for (var i=0;i<markups.length;i+=1) {
		var m=markups[i];
		mindex[m.id]=i;
	}
}

buildIndex();

var getByFile=function(opts){
	var out=[];
	for (var i=0;i<markups.length;i+=1) {
		var m=markups[i];
		if (parseInt(m.uti)===opts.nfile){
			out.push(m);
		} 
	}
	return out;
}

var get=function(opts){
	var i=mindex[opts.id];
	if (i>-1) return markups[i];
}

var list=function(text,type){
	var out=[];
	for (var i=0;i<markups.length;i++){
		var m=markups[i];
		if (text&&type) {
			if (text===m.text && type===m.type) out.push(m);
		} else if (text) {
			if (text===m.text) out.push(m);
		} else if (type) {
			if (type===m.type) out.push(m);
		}
	}
	return out;
}
var uniqueid=function(){
	return 'm'+(Math.random()*10000000).toFixed();
}
var add=function(opts) {
	var member=opts.member;
	var affectedDB={};
	var M=member.map(function(m){
		affectedDB[m.db]=true;
		return {id:uniqueid(), db:m.db,uti:m.uti,
		type:"link",label:opts.label, s:m.s, l:m.l, text:m.text
	}});
	
	if (M.length>2) M[0].target= M.map(function(m){return m.id}).unshift();
	else M[0].target=M[1].id;

	for (var i=1;i<M.length;i+=1) {
		M[i].type="linktarget";
		M[i].target=M[0].id;
	}
	markups=markups.concat(M);
	buildIndex();
	action("markupChanged",affectedDB);
}


registerGetter("getMarkup",get);
registerGetter("listMarkup",list);
registerGetter("getMarkupByFile",getByFile);
module.exports={getByFile,get,add};