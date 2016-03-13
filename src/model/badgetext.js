var {store,action,getter,registerGetter,unregisterGetter}=require("../model");
var badge={};

var BadgeText={
	init:function(){
		store.listen("setBadge",this.setBadge,this);
		registerGetter("getBadge",this.getBadge);
	}
	,finalize:function(){
		unregisterGetter("getBadge");
		store.unlistenAll(this);
	}
	,setBadge:function(opts){
		if (!opts) {
			console.error("wrong param for setBadge");
		}
		if (opts.id) badge[opts.id]=opts.text;
	}
	,getBadge:function(id) {
		return badge[id];
	}
}

BadgeText.init();
module.exports=BadgeText;