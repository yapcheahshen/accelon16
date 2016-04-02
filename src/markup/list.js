var React=require("react-native");
var {
  View,Text,Image,TextInput,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var MarkupList=React.createClass({
	renderRow:function(row,idx){
		return E(Text,{key:idx},row.id,row.text);
	}
	,render:function(){
		return E(View,{},this.props.markups.map(this.renderRow));
	}
});
module.exports=MarkupList;