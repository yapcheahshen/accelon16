var React=require("react-native");
var {
  View,Text,Image,StyleSheet,
  StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;

var orientationMixin=require("./orientation");
var Landscape=require("./landscape");
var Portrait=require("./portrait");
var Screen=require("./screen");

var windowH=screenH=Dimensions.get("window").height;
var windowW=screenW=Dimensions.get("window").width;
var isLandscape=false;
if (windowW>windowH) isLandscape=true;
var flippable=React.createClass({
  mixins:[orientationMixin]
  ,propTypes:{
    body:PropTypes.element.isRequired,
    menu:PropTypes.array.isRequired
  }
  ,getInitialState:function(){
    return {isLandscape:isLandscape,fullscreen:false};
  }
  ,toggleFullScreen:function(){
    var full=!this.state.fullscreen;
    this.setState({fullscreen:full});
    if (Platform.OS==="ios") StatusBarIOS.setHidden(full);
    else if(typeof StatusBarAndroid!=="undefind"){ //defined in index.android.ios
      full?StatusBarAndroid.hideStatusBar():StatusBarAndroid.showStatusBar();
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
      React.createElement(layout,{
        fullscreen:this.state.fullscreen, 
        menu:this.props.menu,
        body:this.props.body})
    );
  }
});
module.exports=flippable;

AppRegistry.registerComponent('accelon16', () => main);