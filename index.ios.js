var React=require("react-native");
var {
  View,Text,Image,StyleSheet,StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform
} =React;
var E=React.createElement;
var mainmenu=require("./src/menu/mainmenu");
var paragraphmenu=require("./src/menu/paragraphmenu");
var tokenmenu=require("./src/menu/tokenmenu");
var Flippable=require("./src/layout/flippable");
var ksa=require("ksana-simple-api");
var SRT=require("./selectable_richtext_test");

var main=React.createClass({
  getInitialState:function(){
    return {menu:mainmenu,mode:null,menuobj:null,loading:true};
  }
  ,componentDidMount:function(){
     var t=new Date();    
     ksa.open({db:"cbeta"},function(err,db){
      console.log(db.get("meta"))
      console.log(new Date()-t);
      setTimeout(function(){
        this.setState({loading:false});
      }.bind(this),500);
    }.bind(this))
 
  }
  ,renderBody:function(){
    if (this.state.loading) {
      return <View style={{top:22}}><Text style={{fontSize:48}}>Loading</Text></View>
    }
    return <SRT/>
  }
  ,render:function(){

    return  <Flippable body={this.renderBody()} menu={this.state.menu(this.state.menuobj)}/>
  }
});

AppRegistry.registerComponent('accelon16', () => main);