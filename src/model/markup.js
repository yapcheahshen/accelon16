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


registerGetter("getMarkup",get);
registerGetter("getMarkupByFile",getByFile);
module.exports={getByFile,get};