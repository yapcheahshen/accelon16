var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var Dictionary=React.createClass({
	contextTypes:{
		action:PT.func
		,store: PT.object
		,getter:PT.func
	}
	,getInitialState:function(){
		var q="如是";
		return {q,markups:[{}]};//
	}	
	,componentDidMount:function(){
		console.log("token menu dictionary mounted")
	}
	,render:function(){
	return E(View, {style:{flex:1,backgroundColor:'orange'}},
		E(Text,{},"selected "));
	}
});

module.exports=Dictionary;