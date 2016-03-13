var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform
} =React;


var {getter}=require("../model");

var Search=require("../search/search");
var Bookmark=require("../scenes/bookmark");
var MarkupEditor=require("../scenes/markupeditor");

var HomeView=React.createClass({
  render:function(){
    return React.createElement(View, {style:{flex:1,backgroundColor:'yellow',height:50}},
    	React.createElement(Text,{},"abc\nasdfasf\naasfsadfs"));
  }
})
var searchicon=require("../../images/find.png");
var linkicon=require("../../images/link.png");
var markupicon=require("../../images/marker.png");
var bookmarkicon=require("../../images/bookmark.png");
var settingsicon=require("../../images/settings.png");
var getMenu=function(obj){
	var menu=[
	{id:"intertext",name:"互文",component:<HomeView/>,icon:linkicon,flex:6},
	{id:"search",name:"記錄",component:<Search/>,icon:searchicon,badgeText:'',flex:6},
	{id:"markup",name:"標記",component:<MarkupEditor/>,icon:markupicon,flex:4},
	{id:"bookmark",name:"書籤",component:<Bookmark/>,icon:bookmarkicon,flex:6},
	{id:"config",name:"設定",component:<HomeView/>,icon:settingsicon,flex:2}
	];
	menu.forEach(function(m){m.badgeText=getter("getBadge",m.id)||""});
	return menu;	
};

module.exports=getMenu;