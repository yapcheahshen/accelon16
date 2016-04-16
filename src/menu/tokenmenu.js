var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;


var {getter}=require("../model");

var Search=require("../search/search");
var Markup=require("../markup/searchmarkup");
var Dictionary=require("../scenes/dictionary");
var copytext=function(){
	console.log("copy text");
}
var google=function(){
	console.log("google");
}
var searchicon=require("../../images/find.png");
var markupicon=require("../../images/findmarkup.png"); //should turn
var dicticon=require("../../images/dictionary.png");
var copytexticon=require("../../images/copytext.png");
var googleicon=require("../../images/google.png");
var getMenu=function(obj){
	var menu=[
	{id:"search",name:"選取",component:<Search/>,icon:searchicon,flex:6},
	{id:"dictionary",name:"字典",component:<Dictionary/>,icon:dicticon,flex:6},
	{id:"searchmarkup",name:"選取",component:<Markup/>,icon:markupicon,flex:6},
	{id:"copy",name:"複製",onPress:copytext,icon:copytexticon,flex:4},
	{id:"google",name:"Google",onPress:google,icon:googleicon,flex:4},
	];
	menu.forEach(function(m){m.badgeText=getter("getBadge",m.id)||""});
	return menu;	
};
module.exports=getMenu;