var React=require("react-native");
var {
  View,Text,Image,StyleSheet,Dimensions,LayoutAnimation,PixelRatio,Platform
} =React;
var E=React.createElement;
var {SelectableRichText,Selections}=require("ksana-selectable-richtext");


var sampletext=require("ksana-selectable-richtext/sampledata/text").map(function(t){return {rawtext:t}});
var samplemarkup=require("ksana-selectable-richtext/sampledata/markups");
var sampletypedef=require("ksana-selectable-richtext/sampledata/typedef");
var sampleselection=require("ksana-selectable-richtext/sampledata/selections");

var MarkupMenu=require("./src/menu/markupmenu");
var selectable_richtext_test=React.createClass({
  getInitialState:function(){
    return {sels:Selections({data:sampleselection})};
  }
  ,markLeft:function(){
    this.refs.srt.markLeft();
  }
  ,markRight:function(){
    this.refs.srt.markRight();
  }
  ,onSelection:function(rowid,sel){
    if (sel.length===0) this.state.sels.clearEmpty();
    if (this.state.sels.set(rowid,sel)){
      this.forceUpdate();
    }
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
    return  E(View,{style:{flex:1}},
              E(MarkupMenu,{onMarkup:this.onMarkup,typedef:sampletypedef
                ,markLeft:this.markLeft,markRight:this.markRight}),
              E(SelectableRichText,{ref:"srt",rows:sampletext 
              ,selections:this.state.sels.getAll()
              ,onSelection:this.onSelection
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
module.exports=selectable_richtext_test;