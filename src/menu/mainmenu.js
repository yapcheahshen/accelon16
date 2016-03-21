var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform
} =React;


var {getter,action}=require("../model");

var Search=require("../search/search");
var Bookmark=require("../scenes/bookmark");
var Markup=require("../markup/markup");

var HomeView=React.createClass({
  render:function(){
    return React.createElement(View, {style:{flex:1,backgroundColor:'yellow',height:50}},
    	React.createElement(Text,{},"abc\nasdfasf\naasfsadfs"));
  }
})
var setFont=function(){
	var zs=getter("zoomScale");
	action("setFontSize",-zs);
}
var helpicon=require("../../images/help.png");
var linkicon=require("../../images/link.png");
var markupicon=require("../../images/dhammagear.png");
var bookmarkicon=require("../../images/bookmark.png");
var settingsicon=require("../../images/settings.png");
var getMenu=function(obj){
	var menu=[
	{id:"help",name:"說明",component:<HomeView/>,icon:helpicon,badgeText:'',flex:6},
	{id:"intertext",name:"互文",component:<HomeView/>,icon:linkicon,flex:6},
	{id:"markup",name:"標記",component:<Markup/>,icon:markupicon,flex:4},
	{id:"bookmark",name:"書籤",component:<Bookmark/>,icon:bookmarkicon,flex:6},
	{id:"config",name:"設定",onPress:setFont,icon:settingsicon,flex:2}
	];
	menu.forEach(function(m){m.badgeText=getter("getBadge",m.id)||""});
	return menu;	
};

module.exports=getMenu;