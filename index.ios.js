var React=require("react-native");
var {
  View,Text,Image,StyleSheet,StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform
} =React;

var mainmenu=require("./src/menu/mainmenu");
var paragraphmenu=require("./src/menu/paragraphmenu");
var tokenmenu=require("./src/menu/tokenmenu");
var SelectableText=require("./src/components/selectabletext");
var Flippable=require("./src/layout/flippable");
var sampletext=require("./sampledata/text").map(function(t){return {rawtext:t}});
var samplemarkup=require("./sampledata/markups");
var {SelectableRichText}=require("ksana-rn-selectable-richtext");
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
  ,onFetchText:function(row,cb) {
    cb(0,sampletext[row].rawtext,row);
  }  
  ,render:function(){
    return (
      <View style={{flex:1,top:22}}>
        <SelectableRichText rows={sampletext} 
        textStyle={styles.textStyle} 
        selectedStyle={styles.selectedStyle}
        selectedTextStyle={styles.selectedTextStyle}
        markups={samplemarkup} onFetchText={this.onFetchText}/>
      </View>
    );
  }
});
//<Flippable body={this.renderBody()} menu={this.state.menu(this.state.menuobj)}/>
var styles=StyleSheet.create({
  textStyle:{fontSize:24},
  selectedStyle:{},
  selectedTextStyle:{}
})
AppRegistry.registerComponent('accelon16', () => main);