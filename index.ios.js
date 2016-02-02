var React=require("react-native");
var {
  View,Text,Image,StyleSheet,
  StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform
} =React;

var mainmenu=require("./src/menu/mainmenu");
var sentencemenu=require("./src/menu/sentencemenu");
var SelectableText=require("./src/components/selectabletext");
var Flippable=require("./src/layout/flippable");
var sentences=[
  "abc abc abcd ",
  "xyz xyz xyz"
]
var main=React.createClass({
  getInitialState:function(){
    return {menu:mainmenu,mode:null,menuobj:null};
  }
  ,renderBody:function(){
    return <SelectableText texts={sentences} onMode={this.setMode}/>
  }
  ,setMode:function(mode,obj){
    LayoutAnimation.spring();
    if (mode==="sentence") {
       this.setState({menu:sentencemenu,mode,menuobj:obj});
    } else {
      this.setState({menu:mainmenu,mode:null,menuobj:null});
    }
  }
  ,render:function(){
    return (
      <View style={{flex:1}}>
        <Flippable body={this.renderBody()} menu={this.state.menu(this.state.menuobj)}/>
      </View>
    );
  }
})

AppRegistry.registerComponent('accelon16', () => main);