var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight,PixelRatio
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var Help=React.createClass({

	render:function(){
		return E(Text,{},"Mark one or more text")
	}
});

module.exports=Help;