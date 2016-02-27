var React=require("react-native");
var {
  View,Text,Image,StyleSheet,Dimensions,LayoutAnimation,PixelRatio,Platform
} =React;
var E=React.createElement;
var {SelectableRichText}=require("ksana-selectable-richtext");


var sampletext=require("ksana-selectable-richtext/sampledata/text").map(function(t){return {rawtext:t}});
var samplemarkup=require("ksana-selectable-richtext/sampledata/markups");
var sampletypedef=require("ksana-selectable-richtext/sampledata/typedef");
var sampleselection=require("ksana-selectable-richtext/sampledata/selections");

var RichTextPopupMenu=require("./src/menu/richtextpopupmenu");

var MarkupMenu=require("./src/menu/markupmenu");
var selectable_richtext_test=React.createClass({
  getInitialState:function(){
    return {selections:sampleselection};
  }
  ,onSetTextRange:function(rowid,sel){
    //if (sel && sel.length===0) this.state.sels.clearEmpty();
    //if (this.state.sels.set(rowid,sel)){
    //  this.forceUpdate();
   // }
  }
  ,onMarkup:function(type){
    console.log(type)
  }
  ,onFetchText:function(row,cb) {
    cb(0,sampletext[row].rawtext,row);
  }
  ,onHyperlink:function(para,mid) {
    console.log(mid.map((m)=>{return {mid:m,obj:samplemarkup[para][m]}}))
  }
  ,render:function(){
    return  E(View,{style:{flex:1}},
              E(SelectableRichText,{ref:"srt",rows:sampletext 
              ,selections:this.state.selections
              ,onSetTextRange:this.onSetTextRange
              ,textStyle:styles.textStyle
              ,onHyperlink:this.onHyperlink
              ,selectedStyle:styles.selectedStyle
              ,selectedTextStyle:styles.selectedTextStyle
              ,markups:samplemarkup
              ,typedef:sampletypedef
              ,onFetchText:this.onFetchText
              ,popup:E(RichTextPopupMenu)})
    );
  }
});
//<Flippable body={this.renderBody()} menu={this.state.menu(this.state.menuobj)}/>
var styles=StyleSheet.create({
  textStyle:{fontSize:28},
  selectedStyle:{},
  selectedTextStyle:{}
})
module.exports=selectable_richtext_test;