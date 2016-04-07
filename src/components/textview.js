/*Pure component to show text and markup , can scrollto an uti, change font size, viewport */
var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var {SelectableRichText}=require("ksana-selectable-richtext");
var RichTextPopupMenu=require("../menu/richtextpopupmenu");
var TOCPopupMenu=require("../menu/tocpopupmenu");
var typedef=require("../typedef");


var TextView=React.createClass({
  contextTypes:{
    action:PT.func
    ,store: PT.object
    ,getter:PT.func
    ,registerGetter:PT.func
    ,unregisterGetter:PT.func
  }
  ,propTypes:{
    db:PT.string.isRequired,
  	rows:PT.array.isRequired,
  	markups:PT.array.isRequired,
  	selections:PT.object.isRequired,
  	name:PT.string,
  	scrollTo:PT.string, //scroll to uti
  	s:PT.number,  //start of highlight
  	l:PT.number,  //length of highlight
  	reload:PT.func.isRequired
  }
  ,fontSize:28
  ,componentWillMount:function(){
  	this.fontSize=this.props.fontSize||28;
  }
  ,onMarkup:function(type){
    console.log(type)
  }
  ,onHyperlink:function(markups,para){
    var M=this.props.markups[para];
    var first=M[markups[0]];

    //TODO , handle multiple markup on same position
    var target=this.context.getter("getMarkup",{id:first.target});
    if (!target && first.type==="head") {
      return E(TOCPopupMenu,{popupX:3,type:"head",vpos:first.vpos,db:this.props.db});
    }
    if (target) {
      var db=target.db||this.props.db ;
      this.context.action("pushText",{db , uti:target.uti , s:target.s, l:target.l }); 
    }

  }
  ,onSetTextRange:function(rowid,sel){

  }
  ,viewportStart:-1 //if set to 0, first load of text might not trigger onViewport
  ,viewportEnd:0
  ,onViewport:function(start,end) {
    if (this.viewportStart!==start||this.viewportEnd!==end) {
      this.viewportStart=start;
      this.viewportEnd=end;
      this.context.action("viewport",this.getViewPort());      
    }
  }
  ,getViewPort:function(){
  	if (this.props.isVisible && !this.props.isVisible()) return null;
    var vp=this.viewportStart;
    if (vp<0) vp=0;
    return {db:this.props.db,uti:this.props.rows[vp].uti,start:vp,end:this.viewportEnd};
  }
  ,componentDidMount:function(){

    this.context.store.listen("scrollToUti",this.scrollToUti,this);
    this.context.store.listen("showToc",this.showToc,this);

    this.context.registerGetter("viewport",this.getViewPort,{overwrite:true});
    this.context.store.listen("setFontSize",this.setFontSize,this);
  }
  ,componentDidUpdate:function(){
    this.context.registerGetter("viewport",this.getViewPort,{overwrite:true});
  }
  ,componentWillUnmount:function(){
    this.context.unregisterGetter("viewport");
    this.context.store.unlistenAll(this);
  }
  ,setFontSize:function(size) {
    if (size<0) {
      this.fontSize=this.fontSize*Math.abs(size);
    } else {
      if (size<10) size=10; else if (size>48) size=48;
      this.fontSize=size;
    }
    this.props.onFontSize && this.props.onFontSize(this.fontSize); 
    this.props.reload();
  }
  ,showToc:function(opts){
    if (this.props.isVisible && this.props.isVisible()) return ; //foreground only
    if (!opts || !opts.popup)return;
    var selecting=this.context.getter("selectedParagraph");
    if (!this.props.rows[selecting])return;
    if (selecting<this.props.rows.length-1) selecting+=1; //vpos of next selecting paragraph
    var vpos=this.props.rows[selecting].vpos; 
    var db=this.props.db;
    var popup= E(opts.popup,{popupX:3,type:"head",vpos , db});
    this.context.action("showTocPopup",{popup});
  }
  ,scrollToUti:function(opts){
    //if (opts.route!==this.props.route) return;
    this.refs.srt.scrollToUti(opts.uti);
  }
  ,onFetchText:function(row,cb) {
    //TODO fetch the markup

    cb(0,this.props.rows[row].text,row);
    return;
  }

  ,onSelectToken:function(opts){
    this.context.action("selectingToken",opts);
  }
  ,onSelectParagraph:function(n) {
    this.context.action("selectingParagraph",n);
  }
  ,render : function(){
    return E(View,{style:{flex:1,paddingTop:45},name:this.props.name},
 	          E(SelectableRichText,
 	          {ref:"srt",rows:this.props.rows 
              ,selections:this.props.selections
              ,onSetTextRange:this.onSetTextRange
              ,textStyle:{fontWeight:'200',fontSize:this.fontSize,lineHeight:this.fontSize*1.5}
              ,onHyperlink:this.onHyperlink
              ,onViewport:this.onViewport
              ,onSelection:this.props.onSelection
              ,selectedStyle:styles.selectedStyle
              ,selectedTextStyle:styles.selectedTextStyle
              ,markups:this.props.markups
              ,typedef:typedef
              ,scrollTo:this.props.scrollTo
              ,onFetchText:this.onFetchText
              ,popup:E(RichTextPopupMenu)
              ,onSelectToken:this.onSelectToken
              ,onSelectParagraph:this.onSelectParagraph})
 	      );
  }

});
var styles=StyleSheet.create({
  selectedStyle:{},
  selectedTextStyle:{}
})
module.exports=TextView;