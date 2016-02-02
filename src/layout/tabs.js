var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform
} =React;


var HomeView=React.createClass({
  render:function(){
    return React.createElement(View, {style:{flex:1,backgroundColor:'green'}},
    	React.createElement(Text,{},"abc"));
  }
})
var searchicon=require("../../images/find.png");
var bookmarkicon=require("../../images/bookmark.png");
var linkicon=require("../../images/link.png");
var dicticon=require("../../images/dictionary.png");
var settingsicon=require("../../images/settings.png");
var getTabs=function(){
	return [
	{name:"Search",component:HomeView,icon:searchicon,badgeText:'9',flex:6},
	{name:"Bookmark",component:HomeView,icon:bookmarkicon,badgeText:'2',flex:5},
	{name:"Link",component:HomeView,icon:linkicon,badgeText:'5',flex:4},
	{name:"Dictionary",component:HomeView,icon:dicticon,badgeText:'5',flex:3},
	{name:"Settings",component:HomeView,icon:settingsicon,badgeText:'2',flex:2}
	]
}

module.exports=getTabs;