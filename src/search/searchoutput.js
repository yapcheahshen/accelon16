var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var ksa=require("ksana-simple-api");
var ResultList=require("./resultlistview");
var SearchOutput=React.createClass({
	getInitialState:function(){
		return {searching:false,items:[]};
	}
	,componentWillMount:function(){
		if (this.props.db && this.props.q) this.getExcerpt(this.props.db,this.props.q);
	}
	,getExcerpt:function(db,q){
		if (!q) {
			this.setState({items:[]});
			return;
		}
		this.setState({searching:true});
		ksa.excerpt({db,q},function(err,items){
			if (err) console.error(err);
			else this.setState({searching:false,items});
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
		return E(ResultList,{fontSize:20,items:this.state.items});
	}
});

module.exports=SearchOutput;