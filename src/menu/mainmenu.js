var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform
} =React;


var HomeView=React.createClass({
  render:function(){
    return React.createElement(View, {style:{flex:1,backgroundColor:'yellow'}},
    	React.createElement(Text,{},"abc"));
  }
})
var searchicon=require("../../images/find.png");
var linkicon=require("../../images/link.png");
var settingsicon=require("../../images/settings.png");
var getMenu=function(obj){
	return [
	{name:"搜尋",component:<HomeView/>,icon:searchicon,badgeText:'9',flex:6},
	{name:"連結",component:<HomeView/>,icon:linkicon,badgeText:'5',flex:4},
	{name:"設定",component:<HomeView/>,icon:settingsicon,badgeText:'2',flex:2}
	];
};

module.exports=getMenu;