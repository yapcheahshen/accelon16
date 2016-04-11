var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform
} =React;

var {getter}=require("../model");

var Search=require("../search/search");
var Bookmark=require("../scenes/bookmark");
var Markup=require("../markup/markup");
var action=require("../model").action;
var TOCPopupMenu=require("./tocpopupmenu");


var HomeView=React.createClass({
  render:function(){
    return React.createElement(View, {style:{flex:1,backgroundColor:'yellow',height:50}},
    	React.createElement(Text,{},"abc\nasdfasf\naasfsadfs"));
  }
})

var Translation=require("../scenes/translation");

var showToc=function(){
	action("showToc",{popup:TOCPopupMenu}); //listen by maintext
}
var searchicon=require("../../images/find.png");
var translationicon=require("../../images/translation.png");
var markupicon=require("../../images/createmarkup.png"); //should turn
var treeicon=require("../../images/map.png");
var kewenicon=require("../../images/kewen.png");
var getMenu=function(obj){
	var menu=[
	{id:"search",name:"歷史",component:<Search/>,icon:searchicon,badgeText:'',flex:6},
	{id:"translation",name:"譯文",component:<Translation/>,icon:translationicon,flex:6},
	{id:"markup",name:"標記",component:<Markup/>,icon:markupicon,flex:4},
	{id:"tree",name:"自訂樹",component:<HomeView/>,icon:treeicon,flex:4},
	{id:"kewen",name:"科判",onPress:showToc,icon:kewenicon,flex:4}

	];
	menu.forEach(function(m){m.badgeText=getter("getBadge",m.id)||""});
	return menu;
};

module.exports=getMenu;