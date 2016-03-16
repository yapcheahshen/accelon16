var {store,action,getter,registerGetter,unregisterGetter}=require("../model");

var markups=[
	{id:'m1',uti:"1@義因文顯",s:9,l:4,type:'link' ,target:"m1t"}
	,{id:'m6',uti:"1@義因文顯", s:6,l:2,type:'synonym'}
	,{id:'m2',uti:"1@證信序",s:1,l:2,type:'synonym'}
	,{id:'m3',uti:"1@證信序",s:7,l:2,type:'synonym2'}
	,{id:'m4',uti:"1@證信序",s:18,l:3,type:'synonym2'}
	,{id:'m5',uti:"1@證信序",s:43,l:3,type:'synonym2'}
	,{id:'m6',uti:"2@即白佛言",s:3,l:2,type:'link',target:'m6t'}
	,{id:'m6t',uti:'3@發心降伏',s:10,l:2}
	,{id:'m1t',uti:"2@即白佛言",s:9,l:5,type:'linktarget',master:'m1'}
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

var uniqueid=function(){
	return 'm'+(Math.random()*10000000).toFixed();
}
var add=function(opts) {
	var member=opts.member;
	var affectedDB={};
	var M=member.map(function(m){
		affectedDB[m.db]=true;
		return {id:uniqueid(), db:m.db,uti:m.uti,
		type:"link",label:opts.label, s:m.s, l:m.l
	}});
	
	if (M.length>2) M[0].target= M.map(function(m){return m.id}).unshift();
	else M[0].target=M[1].id;

	for (var i=1;i<M.length;i+=1) {
		M[i].type="linktarget";
		M[i].source=M[0].id;
	}
	markups=markups.concat(M);
	buildIndex();
	action("markupChanged",affectedDB);
}


registerGetter("getMarkup",get);
registerGetter("getMarkupByFile",getByFile);
module.exports={getByFile,get,add};