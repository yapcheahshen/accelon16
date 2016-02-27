var React=require("react-native");
var {
  View,Text,Image,StyleSheet,StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform
} =React;
var E=React.createElement;
var mainmenu=require("./src/menu/mainmenu");
//var paragraphmenu=require("./src/menu/paragraphmenu");
//var tokenmenu=require("./src/menu/tokenmenu");
var Flippable=require("./src/layout/flippable");

//var SRT=require("./selectable_richtext_test");
var NAV=require("./src/components/nav");
var {store,action,getter,registerGetter}=require("./src/model");
var maintext=require("./src/model/maintext");
var Test=React.createClass({
  render:function(){
    console.log("test")
    return <View><Text>a</Text></View>
  }
})
var main=React.createClass({
  childContextTypes: {
    store: React.PropTypes.object
    ,action:React.PropTypes.func
    ,getter:React.PropTypes.func
    ,registerGetter:React.PropTypes.func
  }
  ,
  getChildContext:function(){
    return {action,store,getter,registerGetter};
  }
  ,getInitialState:function(){
    return {menu:mainmenu,mode:null,menuobj:null,loading:false};
  }
  ,renderBody:function(){
    if (this.state.loading) {
      return <View style={{top:22}}><Text style={{fontSize:48}}>Loading</Text></View>
    }//
    return <View style={{flex:1}}><NAV model={maintext}/></View>
  }
  ,render:function(){
    return  <Flippable body={this.renderBody()} menu={this.state.menu(this.state.menuobj)}/>
  }
});

AppRegistry.registerComponent('accelon16', () => main);