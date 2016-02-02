var React=require("react-native");
var {
  View,Text,Image,StyleSheet,
  StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform
} =React;

var orientationMixin=require("./src/layout/orientation");
var Landscape=require("./src/layout/landscape");
var Portrait=require("./src/layout/portrait");
var Screen=require("./src/layout/screen");
var main=React.createClass({
  mixins:[orientationMixin]
  ,getInitialState:function(){
    return {isLandscape:-1,fullscreen:false};
  }
  ,toggleFullScreen:function(){
    var full=!this.state.fullscreen;
    this.setState({fullscreen:full});
    if (Platform.OS==="ios") StatusBarIOS.setHidden(full);
    else if(typeof StatusBarAndroid!=="undefind"){ //defined in index.android.ios
      full?StatusBarAndroid.hideStatusBar():StatusBarAndroid.showStatusBar();
    }
  }
  ,tapcount:0
  ,inTabBar:function(x,y) {
    if (this.state.isLandscape) {
      return x+49>Screen.height;
    } else {
      return y+49>Screen.height;
    }
  }
  ,onTouchEnd:function(e){
    if (this.inTabBar(e.nativeEvent.pageX,e.nativeEvent.pageY)) {
      this.tapcount=0;
      return;
    }
    clearTimeout(this.timer);
    this.timer=setTimeout(function(){
      this.tapcount=0;
    }.bind(this),300);
    this.tapcount++;
    if(this.tapcount>1) {
      this.toggleFullScreen();
      this.tapcount=0;
    }
  }
  ,render:function(){
    var layout=this.state.isLandscape?Landscape:Portrait;
    return React.createElement(View,{onLayout:this.onLayout,style:{flex:1},onTouchEnd:this.onTouchEnd},
      React.createElement(layout,{fullscreen:this.state.fullscreen})
    );
  }
})

AppRegistry.registerComponent('accelon16', () => main);