var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var MarkupMember=require("./markupmember");
var MarkupEditor=React.createClass({
	render:function(){
		return E(View,null,
			E(Text,null,"Controls")
			,E(MarkupMember)
			);
	}
});

module.exports=MarkupEditor;