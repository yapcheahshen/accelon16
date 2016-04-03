var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var SearchInput=require("./searchinput");
var SearchOutput=require("./searchoutput");
var Search=React.createClass({
	contextTypes:{
		action:PT.func
		,store: PT.object
		,getter:PT.func
	}
	,getInitialState:function(){
		var q="如是";
		this.context.action("setQ",{q});
		return {q};//
	}
	,doSearch:function(q){
		this.setState({q});
		this.context.action("setQ",{q});
	}
	,componentDidMount:function(){
		console.log("search tab mounted")
		this.context.store.listen("selectTab.search",this.onSearchTab,this);
	}
	,componentWillUnmount:function(){
		this.context.store.unlistenAll(this);
	}
	,onSearchTab:function(){
		var q=this.context.getter("selectedText");
		if (q && this.state.q!==q) {
			this.doSearch(q);
		}
	}
	,render:function(){
		var db=this.context.getter("db");
	return E(View, {style:{flex:1,backgroundColor:'lightyellow'}},
		E(SearchInput,{tofindChanged:this.doSearch,q:this.state.q}),
		E(SearchOutput,{q:this.state.q,db:db}));
	}
})

module.exports=Search;