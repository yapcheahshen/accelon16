var React=require("react-native");
var {
  View,Text,TextInput,Image,StyleSheet,TouchableOpacity,PixelRatio,LayoutAnimation
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var model=require("../model/markup");


var Controls=React.createClass({
	contextTypes:{
    	getter:PT.func
	}	
	,propTypes:{
		setLabel:PT.func.isRequired,
		createMarkup:PT.func.isRequired
	}
	,onPress:function(){
		this.props.createMarkup();
	}
	,onChangeText:function(label){
		this.props.setLabel(label);
	}
	,render:function(){
		var landscape=this.context.getter("dimension").landscape;		
		var marginTop=landscape?15:0;
		var marginRight=landscape?50:5;
		var width=this.props.width-styles.labelInput.fontSize-marginRight-10;
		var addable=this.props.canAdd&&this.props.label.length;

		var addablestyle=addable?styles.addable:null;

		var addbuttontext=E(Text,{style:[styles.addbutton,addablestyle]},"+");
		var addbutton=addable?E(TouchableOpacity,{onPress:this.onPress},addbuttontext):addbuttontext;
	

		return E(View,{style:[styles.controls,{marginTop}]}
				,addbutton	
				,E(TextInput,{clearButtonMode:'while-editing',autoCapitalize :"none",
					style:[styles.labelInput,{marginRight}],value:this.props.label,autoCorrect:false,
					onChangeText:this.onChangeText})
				
				
			);
	}
});

var styles={
	controls:{alignItems:'flex-end',flexDirection:'row',justifyContent:'flex-end'},
	addbutton:{marginLeft:5,fontSize:38,color:'rgb(192,192,192)'},
	addable:{color:'rgb(0,122,255)'},
	labelInput:{flex:1,marginLeft:5,marginTop:12,marginRight:5,fontSize:24,borderRadius:5,
		borderColor:'rgb(128,128,128)',height:30,borderWidth:1/PixelRatio.get()},	
}
module.exports=Controls;