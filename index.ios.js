var React=require("react-native");
var {
  View,Text,Image,StyleSheet,StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform
} =React;

var mainmenu=require("./src/menu/mainmenu");
var paragraphmenu=require("./src/menu/paragraphmenu");
var tokenmenu=require("./src/menu/tokenmenu");
var SelectableText=require("./src/components/selectabletext");
var Flippable=require("./src/layout/flippable");
var sampletext=require("./sampletext").slice(0,15);

var main=React.createClass({
  getInitialState:function(){
    return {menu:mainmenu,mode:null,menuobj:null};
  }
  ,renderBody:function(){
    return <SelectableText texts={sampletext} onMode={this.setMode}/>
  }
  ,setMode:function(mode,obj){
  
    if (mode==="paragraph") {
      this.setState({menu:paragraphmenu,mode,menuobj:obj});
    } else if (mode==="token") {
      this.setState({menu:tokenmenu,mode,menuobj:obj});
    } else {
       LayoutAnimation.spring();
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