var React=require("react-native");
var {
  View,Text,StyleSheet,
  TouchableHighlight,PropTypes
} =React;
var E=React.createElement;
var Button=require("../components/button");

var MarkupMenu=React.createClass({
	propType:{
		markLeft:PropTypes.func.isRequired,
		markRight:PropTypes.func.isRequired,
		onMarkup:PropTypes.func.isRequired,
	}
	,renderMarkup:function(){
		var out=[],typedef=this.props.typedef;
		for (var t in typedef) {
			out.push(E(Button,{key:t,text:t,param:t,onPress:this.props.onMarkup}));
		}
		return out;
	}
	,render:function(){
		return E(View,{ style:{flexDirection:'row',justifyContent:'space-around'}}
			,E(Button,{text:"<",onPress:this.props.markLeft})
			,E(Button,{text:">",onPress:this.props.markRight})
			,this.renderMarkup()
			);
	}
})
module.exports=MarkupMenu;