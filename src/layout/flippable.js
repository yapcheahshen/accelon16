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
  ,tapcount:0
  ,inTabBar:function(x,y) {
    if (this.state.isLandscape) {
      return x+49>Screen.height;
    } else {
      return y+49>Screen.height;
    }
  }
  ,componentWillReceiveProps:function(){
    this.tapcount=0; //reset tap count if mode changed cause full refresh
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
      React.createElement(layout,{fullscreen:this.state.fullscreen, menu:this.props.menu,body:this.props.body})
    );
  }
});
module.exports=flippable;

AppRegistry.registerComponent('accelon16', () => main);