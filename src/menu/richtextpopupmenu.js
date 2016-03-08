var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;

var Button=require("../components/button");
var RichTextPopupMenu=React.createClass({
	contextTypes:{
		action:React.PropTypes.func
	}
	,selLengthPlusOne:function(){
		this.context.action("selLengthPlusOne");
	}
	,selLengthPunc:function(){
		this.context.action("selLengthTillPunc");
	}
	,saveSelection:function(){
		this.context.action("addSelection");
	}
	,render:function(){
		return E(View,{style:styles.popup}
			,E(Button,{buttonStyle:styles.buttonStyle,onPress:this.selLengthPlusOne,text:">"})
			,E(Button,{buttonStyle:styles.buttonStyle,onPress:this.selLengthPunc,text:">."})
			,E(Button,{buttonStyle:styles.buttonStyle,onPress:this.saveSelection,text:"+"})
			);
	}
});
var styles=StyleSheet.create({
	buttonStyle:{fontSize:24}
	,popup:{flexDirection:'row',height:44,justifyContent:"space-between",width:140,alignItems:"stretch"}
});
module.exports=RichTextPopupMenu;