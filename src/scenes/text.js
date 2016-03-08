/* text scene*/
var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var {SelectableRichText}=require("ksana-selectable-richtext");
var RichTextPopupMenu=require("../menu/richtextpopupmenu");
var typedef=require("../typedef");

var TextScene=React.createClass({
  contextTypes:{
    action:PT.func
    ,store: PT.object
    ,getter:PT.func
  }
  ,propTypes:{
    route:PT.object.isRequired
    ,navigator:PT.object.isRequired
  }
  ,getInitialState:function(){
  	return {markups:[],rows:[],selections:{},ready:false};
  }
  ,onMarkup:function(type){
    console.log(type)
  }
  ,onHyperlink:function(markups,para){
    var M=this.state.markups[para];
    //TODO , handle multiple markup on same position
    var target=M[markups[0]].target, db=target.db||this.props.route.db ;
    this.context.action("pushText",{db , uti:target.uti , s:target.s, l:target.l });
  }
  ,onSetTextRange:function(rowid,sel){

  }
  ,onViewport:function(start,end) {

  }
  //,shouldComponentUpdate:function(nextProps,nextState){
  //  return nextState.rows != this.state.rows ;
  //}
  ,hits2markups:function(markups,rows){
    var hits,nhit=0,i,j;
    for (i=0;i<rows.length;i+=1) {
      hits=rows[i].hits;
      if (!hits || !hits.length) continue;
      if (!markups[i]) markups[i]={};
      for (j=0;j<hits.length;j+=1) {
        var hit=hits[j];
        markups[i]["h"+nhit]={s:hit[0],l:hit[1],type:"hl"};
        nhit+=1;
      }
    }
    return markups;
  }
  ,buildMarkups:function(rawmarkups,rows){
    var markups=[];
    var segments=rows.map(function(r){return r.uti});
    for (var m in rawmarkups) {
      var i=segments.indexOf(m);
      if (i>-1) {
        markups[i]=rawmarkups[m];
      } else {
        console.warn("segment id "+m+" not found");
      }
    }

    return this.hits2markups(markups,rows);
  }
  ,componentWillReceiveProps:function(nextProps){
    if (nextProps.route!==this.props.route) {
      this.getRows(function(rows){
        var markups=this.buildMarkups(nextProps.route.markups||{},rows);
        this.setState({rows,markups});
      }.bind(this));
    }
  }
  ,getRows:function(cb) {
    var getter=this.context.getter,
      db=this.props.route.db,nfile=this.props.route.nfile,q=this.props.route.q;
    getter("segments",{db,nfile},function(segments){
      getter("contents",{db, uti:segments, q},function(data){
        cb(data.map(function(d){return {uti:d.uti,text:d.text,hits:d.hits}}));
      });
    });
  }
  ,componentDidMount:function(){
    this.getRows(function(rows){
      var markups=this.buildMarkups(this.props.route.markups||{},rows);
      this.setState({rows,markups,ready:true});
    }.bind(this));

    this.context.store.listen("scrollToUti",this.scrollToUti,this);
  }
  ,componentWillUnmount:function(){
    this.context.store.unlistenAll(this);
  }
  ,scrollToUti:function(opts){
    if (opts.route!==this.props.route) return;
    this.refs.srt.scrollToUti(opts.uti);
  }
  ,onFetchText:function(row,cb) {
    //TODO fetch the markup

    cb(0,this.state.rows[row].text,row);
    return;
  }
  ,onSelection:function(row,selstart,sellen){
    var selections=JSON.parse(JSON.stringify(this.state.selections));
    if (selections[row]) {
      selections[row].push([selstart,sellen]);
    } else {  
      selections[row]=[[selstart,sellen]];
    }
    this.setState({selections:selections});
  }
  ,render : function(){
    if (!this.state.ready) {
      return E(View,{},E(Text,null,"Loading"));
    }
    return E(View,{style:{flex:1,paddingTop:45},name:this.props.route.name},
 	          E(SelectableRichText,
 	          {ref:"srt",rows:this.state.rows 
              ,selections:this.state.selections
              ,onSetTextRange:this.onSetTextRange
              ,textStyle:styles.textStyle
              ,onHyperlink:this.onHyperlink
              ,onViewport:this.onViewport
              ,onSelection:this.onSelection
              ,selectedStyle:styles.selectedStyle
              ,selectedTextStyle:styles.selectedTextStyle
              ,markups:this.state.markups
              ,typedef:typedef
              ,scrollTo:this.props.route.scrollTo
              ,onFetchText:this.onFetchText
              ,popup:E(RichTextPopupMenu)})
 	      );
  }

});
var styles=StyleSheet.create({
  textStyle:{fontSize:28},
  selectedStyle:{},
  selectedTextStyle:{}
})
module.exports=TextScene;