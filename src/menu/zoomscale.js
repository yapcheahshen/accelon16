var React=require("react-native");
var {
  View,Text,Image,ListView,StyleSheet,TouchableOpacity
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var Button=require("../components/button");

var ZoomScalePopup=React.createClass({
	contextTypes:{
		getter:PT.func.isRequired
		,action:PT.func.isRequired
	}
	,propTypes:{
		defaultFontSize:PT.number.isRequired
	}
	,defaultFontSize:function(){
		this.context.action("setFontSize",this.props.defaultFontSize);
	}
	,applyFontSize:function(){
		var zs=this.context.getter("zoomScale");
		this.context.action("setFontSize",-zs);
	}
	,render:function(){
		return E(View,{style:{flex:1}},
			E(Button,{onPress:this.defaultFontSize,text:"Reset Fontsize"}),
			E(View,{style:styles.sep}),
			E(Button,{onPress:this.applyFontSize,text:"Apply Font Size"})
		);
	}
});
var styles={
	sep:{margin:3,height:5,backgroundColor:"blue"}
	,button:{padding:10}
}
module.exports=ZoomScalePopup;