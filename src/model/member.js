/* member of current editing/creating markups */
var sample=[
			{db:"dsl_jwn",uti:"1@義因文顯",s:11,l:2,text:"文顯"}
			,{db:"dsl_jwn",uti:"1@義因文顯",s:15,l:4,text:"觀照般若"}
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
	,addSelections:function({db,selections}){
		//TODO , remove duplicate selection
		members=members.filter(function(m){return m.db!==db});
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