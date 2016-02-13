var React=require("react-native");
var {
  View,Text,Image,StyleSheet,StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform
} =React;
var E=React.createElement;
var mainmenu=require("./src/menu/mainmenu");
var paragraphmenu=require("./src/menu/paragraphmenu");
var tokenmenu=require("./src/menu/tokenmenu");
var Flippable=require("./src/layout/flippable");

var SRT=require("./selectable_richtext_test");

var main=React.createClass({
  getInitialState:function(){
    return {menu:mainmenu,mode:null,menuobj:null};
  }
  ,renderBody:function(){
    return <SRT/>
  }
  ,render:function(){
    return  <Flippable body={this.renderBody()} menu={this.state.menu(this.state.menuobj)}/>
  }
});
//

AppRegistry.registerComponent('accelon16', () => main);