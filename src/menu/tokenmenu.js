var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;


var HomeView=React.createClass({
	propTypes:{
		obj:PropTypes.object.isRequired
	}
	,render:function(){
	return React.createElement(View, {style:{flex:1,backgroundColor:'orange'}},
		React.createElement(Text,{},"selected "+this.props.obj.idx));
	}
})

var dicticon=require("../../images/dictionary.png");
var getMenu=function(obj){

	return [
	{name:"字典",component:<HomeView obj={obj}/>,icon:dicticon,badgeText:'5',flex:3}
	];
};
module.exports=getMenu;