var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var SearchInput=require("./searchinput");
var MarkupList=require("./list");
var SearchMarkup=React.createClass({
	contextTypes:{
		action:PT.func
		,store: PT.object
		,getter:PT.func
	}
	,getInitialState:function(){
		var q="如是";
		return {q,markups:[{}]};//
	}
	,doSearch:function(q){
		var markups=this.context.getter("listMarkup",this.state.q);
		this.setState({markups});
	}
	,componentDidMount:function(){
		console.log("search markup tab mounted")
		this.doSearch(this.state.q);
		this.context.store.listen("selectTab.searchmarkup",this.onSearchMarkupTab,this);
	}
	,componentWillUnmount:function(){
		this.context.store.unlistenAll(this);
	}
	,onSearchMarkupTab:function(){
		var q=this.context.getter("selectedText");
		if (q && this.state.q!==q) {
			this.doSearch(q);
		}
	}
	,render:function(){
		return E(View, {style:{flex:1,backgroundColor:'lightyellow'}},
		E(SearchInput,{tofindChanged:this.doSearch,q:this.state.q}),
		E(MarkupList,{markups:this.state.markups}));
	}
});

module.exports=SearchMarkup;