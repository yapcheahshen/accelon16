
var React=require("react-native");
var {
  View,Text,Image,StyleSheet
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var Button=require("../components/button");
var Config=React.createClass({
	contextTypes:{
		action:PT.func.isRequired
	}
	,sampleMarkup:function(){
		this.context.action("sampleMarkup");
	}	
	,resetMarkup:function(){
		this.context.action("resetMarkup");
	}
	,render:function(){
		return E(View,{flex:1,style:styles.container},
				 E(Text,{},"Configuration"),
				 E(Button,{onPress:this.sampleMarkup,text:"sample markup"}),
				E(Button,{onPress:this.resetMarkup,text:"delete all markup"})
				);
	}
});

var styles={
	container:{backgroundColor:'lightyellow'}
}

module.exports=Config;