var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;


var {getter}=require("../model");

var Search=require("../search/search");
var MarkupEditor=require("../scenes/markupeditor");
var HomeView=React.createClass({
	render:function(){
	return React.createElement(View, {style:{flex:1,backgroundColor:'orange'}},
		React.createElement(Text,{},"selected "+this.props.obj.idx));
	}
});

var searchicon=require("../../images/find.png");
var markupicon=require("../../images/marker.png");
var dicticon=require("../../images/dictionary.png");
var getMenu=function(obj){
	var menu=[
	{id:"dictionary",name:"字典",component:<HomeView/>,icon:dicticon,flex:3},
	{id:"search",name:"選取",component:<Search/>,icon:searchicon,flex:6},
	{id:"markup",name:"標記",component:<MarkupEditor/>,icon:markupicon,flex:4},
	];
	menu.forEach(function(m){m.badgeText=getter("getBadge",m.id)||""});
	return menu;	
};
module.exports=getMenu;