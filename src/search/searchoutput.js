var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var ksa=require("ksana-simple-api");
var ResultList=require("./resultlistview");
var SearchOutput=React.createClass({
	contextTypes:{
		action:PT.func
	}
	,getInitialState:function(){
		return {searching:false,items:[]};
	}
	,componentWillMount:function(){
		if (this.props.db && this.props.q) this.getExcerpt(this.props.db,this.props.q);
	}
	,formatHitCount:function(hit){
		if (hit<100) return hit;
		else {
			return (Math.floor(hit/1000)+1)+"K";
		}
	}
	,getExcerpt:function(db,q){
		if (!q) {
			this.setState({items:[]});
			return;
		}
		this.setState({searching:true});
		ksa.excerpt({db,q},function(err,items){
			if (err) console.error(err);
			else {
				this.context.action("setBadge",{id:"search",text:this.formatHitCount(items.length)});
				this.setState({searching:false,items});
			} 
		}.bind(this));
	}
	,componentWillReceiveProps:function(nextProps){
		if (nextProps.q!==this.props.q || nextProps.db!==this.props.db) {
			this.getExcerpt(nextProps.db,nextProps.q);
		}
	}
	,render:function(){
		if (this.state.searching) {
			return E(Text,{},"Searching");
		}
		return E(ResultList,{db:this.props.db,fontSize:20,items:this.state.items});
	}
});

module.exports=SearchOutput;