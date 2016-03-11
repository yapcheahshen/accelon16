
var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var Bookmark=React.createClass({
	render:function(){
		return E(Text,null,"bookmark");
	}
});
module.exports=Bookmark;