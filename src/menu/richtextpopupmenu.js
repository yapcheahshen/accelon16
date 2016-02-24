var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;

var Button=require("../components/button");
var RichTextPopupMenu=React.createClass({
	contextTypes:{
		action:React.PropTypes.object
	}
	,selLengthPlusOne:function(){
		this.context.action.selLengthPlusOne&&this.context.action.selLengthPlusOne();
	}
	,selLengthPunc:function(){
		this.context.action.selLengthPunc&&this.context.action.selLengthPunc();
	}
	,saveSelection:function(){
		this.context.action.saveSelection&&this.context.action.saveSelection();
	}
	,render:function(){
		return E(View,{style:styles.popup}
			,E(Button,{onPress:this.selLengthPlusOne,text:">"})
			,E(Button,{onPress:this.selLengthPunc,text:">."})
			,E(Button,{onPress:this.saveSelection,text:"+"})
			);
	}
});
var styles=StyleSheet.create({
	popup:{flexDirection:'row',height:34,justifyContent:"space-between",width:140}
});
module.exports=RichTextPopupMenu;