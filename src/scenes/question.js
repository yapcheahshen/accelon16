var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight,AsyncStorage
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var Question=React.createClass({
	render:function(){
		return E(Text,null,"Question")
	}
});

module.exports=Question;