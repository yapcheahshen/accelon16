var React=require("react-native");
var {
  View,Text,Image,StyleSheet,StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform
} =React;
var E=React.createElement;
var mainmenu=require("./src/menu/mainmenu");
var paragraphmenu=require("./src/menu/paragraphmenu");
var tokenmenu=require("./src/menu/tokenmenu");
var Flippable=require("./src/layout/flippable");
var sampletext=require("./sampledata/text").map(function(t){return {rawtext:t}});
var samplemarkup=require("./sampledata/markups");
var sampletypedef=require("./sampledata/typedef");
var {SelectableRichText}=require("ksana-rn-selectable-richtext");
var MarkupMenu=require("./src/menu/markupmenu");
var main=React.createClass({
  getInitialState:function(){
    return {menu:mainmenu,mode:null,menuobj:null};
  }
  ,setMode:function(mode,obj){
  
    if (mode==="paragraph") {
      this.setState({menu:paragraphmenu,mode:mode,menuobj:obj});
    } else if (mode==="token") {
      this.setState({menu:tokenmenu,mode:mode,menuobj:obj});
    } else {
       LayoutAnimation.spring();
      this.setState({menu:mainmenu,mode:null,menuobj:null});
    }
  }
  ,markLeft:function(){
    this.refs.srt.markLeft();
  }
  ,markRight:function(){
    this.refs.srt.markRight();
  }
  ,onMarkup:function(type){
    var sel=this.refs.srt.getSelection();
    if (sel.paraStart===-1||sel.paraEnd===-1) return; //no selected paragraph
    if (sel.selStart===-1||sel.selEnd===-1)return;//no selection
    if (sel.paraStart!==sel.paraEnd)return;//only single paragraph selection is supported
    
    if (!samplemarkup[sel.paraStart]) samplemarkup[sel.paraStart]={};
    var mid='m'+Math.round(Math.random()*1000000);
    samplemarkup[sel.paraStart][mid]={s:sel.selStart,l:sel.selEnd-sel.selStart+1,type:type}
    this.refs.srt.cancelSelection();
  }
  ,onFetchText:function(row,cb) {
    cb(0,sampletext[row].rawtext,row);
  }
  ,onHyperlink:function(para,mid) {

    console.log(mid.map((m)=>{return {mid:m,obj:samplemarkup[para][m]}}))
  }
  ,render:function(){
    return  E(View,{style:{flex:1,top:22}},
              E(MarkupMenu,{onMarkup:this.onMarkup,typedef:sampletypedef
                ,markLeft:this.markLeft,markRight:this.markRight}),
              E(SelectableRichText,{ref:"srt",rows:sampletext 
              ,textStyle:styles.textStyle
              ,onHyperlink:this.onHyperlink
              ,selectedStyle:styles.selectedStyle
              ,selectedTextStyle:styles.selectedTextStyle
              ,markups:samplemarkup
              ,typedef:sampletypedef
              ,onFetchText:this.onFetchText})
    );
  }
});
//<Flippable body={this.renderBody()} menu={this.state.menu(this.state.menuobj)}/>
var styles=StyleSheet.create({
  textStyle:{fontSize:28},
  selectedStyle:{},
  selectedTextStyle:{}
})
AppRegistry.registerComponent('accelon16', () => main);