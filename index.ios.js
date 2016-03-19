var React=require("react-native");
var {
  View,Text,Image,StyleSheet,AppRegistry,Dimensions,Platform,PixelRatio
} =React;
var E=React.createElement;
var mainmenu=require("./src/menu/mainmenu");
var paragraphmenu=require("./src/menu/paragraphmenu");
var tokenmenu=require("./src/menu/tokenmenu");
var Flippable=require("./src/layout/flippable");

//var SRT=require("./selectable_richtext_test");
var NAV=require("./src/components/nav");
var {store,action,getter,registerGetter,unregisterGetter}=require("./src/model");
var maintext=require("./src/model/maintext");
var downloadfile=require("./downloadfile");
var PT=React.PropTypes;
var Test=React.createClass({
  render:function(){
    console.log("test")
    return <View><Text>a</Text></View>
  }
})
var main=React.createClass({
  childContextTypes: {
    store: PT.object
    ,action: PT.func
    ,getter: PT.func
    ,registerGetter:PT.func
    ,unregisterGetter:PT.func
  }
  ,selectingTab:false
  ,selectingParagraph:-1
  ,componentDidMount:function(){
    store.listen("selectingParagraph",this.selectingParagraph,this);
    store.listen("selectingToken",this.selectingToken,this);
    store.listen("selectTab",this.selectTab,this);
    store.listen("unselectTab",this.unselectTab,this);

    downloadfile(function(){
      this.setState({loading:false});
    }.bind(this));

  }
  ,selectTab:function(){
    this.selectingTab=true;
  }
  ,unselectTab:function(){
    this.selectingTab=false;
    var menu=this.selectingParagraph===-1?mainmenu:paragraphmenu;
    if (menu!==this.state.menu) this.setState({menu}); //update menu
  }
  ,componentWillUnmount:function(){
    store.unlistenAll(this);
  }
  ,selectingToken:function(opts) {
    console.log(opts);
  }
  ,selectingToken:function(opts) {
    this.setState({menu:opts.selStart>-1?tokenmenu:paragraphmenu});
  }
  ,selectingParagraph:function(n){
    this.selectingParagraph=n;
    if (this.selectingTab) return; //do not change menu when tabnav is activated

    this.setState({menu:n===-1?mainmenu:paragraphmenu});
  }
  ,getChildContext:function(){
    return {action,store,getter,registerGetter,unregisterGetter};
  }
  ,getInitialState:function(){
    return {menu:mainmenu,mode:null,menuobj:null,loading:true};
  }
  ,renderBody:function(){
    if (this.state.loading) {
      return <View style={{top:22,flexDirection:'row'}}>

      <Text style={{fontSize:48}}>Loading</Text>
        <Text style={{color:"#a0a0a0",fontSize:24,marginLeft:-24,marginTop:-10,
        backgroundColor:'rgba(0,0,0,0)',borderRadius:12,width:24,height:24,justifyContent:'space-around',
        borderWidth:1/PixelRatio.get(),borderColor:'red',borderStyle:'solid'}}>中
      </Text>
      <Text style={{fontSize:48}}>QQQ </Text>
     </View>
    }
    return <View style={{flex:1}}><NAV model={maintext}/></View>
  }
  ,render:function(){
    return  <Flippable body={this.renderBody()} menu={this.state.menu(this.state.menuobj)}/>
  }
});

AppRegistry.registerComponent('accelon16', () => main);