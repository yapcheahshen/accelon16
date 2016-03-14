/* member of current editing/creating markups */
var sample=[
			{db:"dsl_jwn",uti:"1@義因文顯",s:17,l:2,text:"般若"}
			,{db:"dsl_jwn",uti:"2@時須菩提",s:34,l:2,text:"世尊"}
			,{db:"dsl_jwn",uti:"3@佛告菩薩",s:44,l:2,text:"離相"}
		]
var members=sample;

var {store,action,getter,registerGetter,unregisterGetter}=require("../model");


var Member={
	init:function(){
		registerGetter("getMember",this.getMember);
		store.listen("addSelections",this.addSelections,this);
	}
	,finalize:function(){
		unregisterGetter("getMember");
		store.unlistenAll(this);
	}
	,addSelections:function({db,nfile,selections}){
		//TODO , remove duplicate selection
		members=members.filter(function(m){
			var mnfile=parseInt(m.uti.substr(0,m.uti.indexOf("@"))); //use generic UTI parser
			return !(m.db===db && mnfile===nfile);
		});
		members=members.concat(selections);
		action("setBadge",{id:"markup",text:members.length});
		action("markupMember",this.getMember());
	}
	,add:function(){

	}
	,remove:function(i){
		members.splice(i,1);
		action("setBadge",{id:"markup",text:members.length});
		action("markupMember",this.getMember());
	}
	,getMember:function(opts){
		if (!opts) {
			return members.slice();
		} else {
			return members.filter(function(m){
				if (opts.db && m.db!==opts.db) return false;
				if (opts.nfile && parseInt(m.uti.substr(0,m.uti.indexOf("@")))!==opts.nfile) return false;
				if (opts.uti && m.uti!==opts.uti) return false;
				return true;
			});
		}
	}
}

Member.init();
module.exports=Member;