
var React=require("react-native");
var {
  View,ScrollView,Text,TextInput,Image,StyleSheet,TouchableOpacity,PixelRatio,LayoutAnimation
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var TextView=require("../components/textview");
var db="ds"
var Translation=React.createClass({
	contextTypes:{
		action:PT.func
		,store: PT.object
		,getter:PT.func
	}
	,getInitialState:function(){
		return {start:0,rows:[{text:"empty"}]};
	}
	,fetch:function(){
		var vp=this.context.getter("viewport");
		this.fetchTranslation(parseInt(vp.uti));
	}
	,onShow:function(){
		this.fetch();
		this.fetchTranslation();
	}
	,onHide:function(){
		//console.log("onhide");
	}
	,fetchTranslation:function(nfile){
		if (isNaN(nfile))return;
		if (nfile===this.nfile)return;
		this.context.getter("segments",{db,nfile},function(segments){
		    this.context.getter("contents",{db, uti:segments},function(data){
		        this.setState({rows:
		        	data.map(function(d){return {uti:d.uti,text:d.text,hits:d.hits,tags:d.markups,vpos:d.vpos}})});
		    }.bind(this));
			this.nfile=nfile;
		}.bind(this));	
	}
	,componentDidMount:function(){
		this.context.store.listen("selectTab.translation",this.onShow,this);
		//this is stupid, tabnav should have access to children instance
		this.context.store.listen("unselectTab.translation",this.onHide,this); 
		this.context.store.listen("viewport",this.onViewport,this);
		this.fetch();
	}
	,componentWillUnmount:function(){
		this.context.store.unlistenAll(this);
	}
	,onViewport:function(vp){
		if (vp && vp.uti) this.fetchTranslation(parseInt(vp.uti));
	}
	,renderRow:function(item,idx) {
		return E(Text,{key:idx,style:{fontFamily:"DFKai-SB",fontSize:24,fontWeight:'200'}},item.text.trim());
	}
	,render:function(){
		return E(View,{style:{flex:1,backgroundColor:"#CFCFCF"}},
				E(View,{style:{height:1/PixelRatio.get(),backgroundColor:"#7f7f7f"}}),
				E(ScrollView,{style:{flex:1}},this.state.rows.map(this.renderRow))
				//E(TextView,{rows:this.state.rows.map(function(r){return r.text})})
			);
	}
});

module.exports=Translation;