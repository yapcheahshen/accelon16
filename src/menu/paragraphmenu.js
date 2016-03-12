var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform
} =React;

var Search=require("../search/search");
var Bookmark=require("../scenes/bookmark");
var action=require("../model").action;
var TOCPopupMenu=require("./tocpopupmenu");
var HomeView=React.createClass({
  render:function(){
    return React.createElement(View, {style:{flex:1,backgroundColor:'yellow',height:50}},
    	React.createElement(Text,{},"abc\nasdfasf\naasfsadfs"));
  }
})

var showToc=function(){
	action("showToc",{popup:TOCPopupMenu}); //listen by maintext
}
var searchicon=require("../../images/find.png");
var linkicon=require("../../images/link.png");
var markupicon=require("../../images/marker.png");
var treeicon=require("../../images/map.png");
var kewenicon=require("../../images/kewen.png");
var getMenu=function(obj){
	return [
	{id:"intertext",name:"互文",component:<HomeView/>,icon:linkicon,badgeText:'',flex:6},
	{id:"search",name:"搜尋",component:<Search/>,icon:searchicon,badgeText:'',flex:6},
	{id:"markup",name:"標記",component:<HomeView/>,icon:markupicon,badgeText:'',flex:4},
	{id:"tree",name:"樹",component:<HomeView/>,icon:treeicon,badgeText:'',flex:4},
	{id:"kewen",name:"科判",onPress:showToc,icon:kewenicon,badgeText:'',flex:4}

	];
};

module.exports=getMenu;