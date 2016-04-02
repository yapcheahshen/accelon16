var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight,AsyncStorage
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var TextView=require("../components/textview");
var TextMarkup=require("../markup/textmarkup");

var fontSize=28;
var TextScene=React.createClass({
  propTypes:{
    route:PT.object.isRequired
    ,navigator:PT.object.isRequired
  }
  ,componentWillMount:function(){
    AsyncStorage.getItem("FONTSIZE",function(err,r){
      fontSize=parseFloat(r)||fontSize;
    });
  }
  ,onFontSize:function(fontsize) {
    AsyncStorage.setItem("FONTSIZE",fontsize.toString());
  }
  ,reload:function(route){
    route=route||this.props.route;
  } 
  ,componentWillReceiveProps:function(nextProps,nextState){
    if (nextProps.route!==this.props.route) {
      this.reload(nextProps.route);
    }
  }
  ,isVisible:function(){
   return (this.props.route.index===this.props.navigator.getCurrentRoutes().length-1);
  }
  ,render:function(){
    var {db,nfile,q,name,scrollTo,s,l,uti}=this.props.route;
    return E(TextMarkup,{db,nfile,q,scrollTo,fontSize,component:TextView,
      onFontSize:this.onFontSize,isVisible:this.isVisible});
  }
  
});

module.exports=TextScene;