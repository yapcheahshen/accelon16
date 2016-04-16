var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;


var {getter}=require("../model");
var Translation=require("../scenes/translation");
var Search=require("../search/search");
var Config=require("../scenes/config");
var Markup=require("../markup/searchmarkup");
var Question=require("../scenes/question");
var copytext=function(){
	console.log("copy text");
}
var google=function(){
	console.log("google");
}
var searchicon=require("../../images/find.png");
var helpicon=require("../../images/help.png");
var markupicon=require("../../images/findmarkup.png"); //should turn
var linkicon=require("../../images/link.png");
var settingsicon=require("../../images/settings.png");
var getMenu=function(obj){
	var menu=[
	{id:"search",name:"選取",component:<Search/>,icon:searchicon,flex:6},
	{id:"translation",name:"互文",component:<Translation/>,icon:linkicon,flex:6},
	{id:"searchmarkup",name:"選取",component:<Markup/>,icon:markupicon,flex:6},
	{id:"question",name:"問答",component:<Question/>,icon:helpicon,badgeText:'',flex:6},
	{id:"config",name:"設定",component:<Config/>,icon:settingsicon,flex:4}
	];
	menu.forEach(function(m){m.badgeText=getter("getBadge",m.id)||""});
	return menu;	
};
module.exports=getMenu;