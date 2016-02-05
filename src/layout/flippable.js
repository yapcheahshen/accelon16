var React=require("react-native");
var {
  View,Text,Image,StyleSheet,
  StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;

var orientationMixin=require("./orientation");
var Landscape=require("./landscape");
var Portrait=require("./portrait");
var Screen=require("./screen");
var flippable=React.createClass({
  mixins:[orientationMixin]
  ,propTypes:{
    body:PropTypes.element.isRequired,
    menu:PropTypes.array.isRequired
  }
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
  ,inTabBar:function(x,y) {
    if (this.state.isLandscape) {
      return x+49>Screen.height;
    } else {
      return y+49>Screen.height;
    }
  }
  ,onTouchStart:function(e){
    if(e.nativeEvent.touches.length===3) {
      this.toggleFullScreen();
    }
  }
  ,render:function(){
    var layout=this.state.isLandscape?Landscape:Portrait;
    return React.createElement(View,{onLayout:this.onLayout,style:{flex:1}, 
      onTouchStart:this.onTouchStart},
      React.createElement(layout,{fullscreen:this.state.fullscreen, menu:this.props.menu,body:this.props.body})
    );
  }
});
module.exports=flippable;

AppRegistry.registerComponent('accelon16', () => main);