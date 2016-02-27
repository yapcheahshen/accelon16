/* text scene*/
var React=require("react-native");
var {
  View,Text,Image,StyleSheet,LayoutAnimation,TouchableHighlight
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
  	return {markups:{},rows:[],selections:{},ready:false};
  }
  ,onMarkup:function(type){
    console.log(type)
  }
  ,onSetTextRange:function(rowid,sel){

  }
  ,onViewportChanged:function(start,end) {

  }
  //,shouldComponentUpdate:function(nextProps,nextState){
  //  return nextState.rows != this.state.rows ;
  //}
  ,componentWillReceiveProps:function(nextProps){
    if (nextProps.route!==this.props.route) {
      this.getRows(function(rows){
        this.setState({rows});
      }.bind(this));
    }
  }
  ,getRows:function(cb) {
    this.context.getter("segments",{db:this.props.route.db,nfile:this.props.route.nfile},function(segments){
      cb( segments.map((uti)=> {return {uti} } ));
    });
  }
  ,componentDidMount:function(){
    this.getRows(function(rows){
      this.setState({rows,ready:true});
    }.bind(this));
  }
  ,onFetchText:function(row,cb) {
  	this.context.getter("content",{db:this.props.route.db,uti:this.state.rows[row].uti},function(data){
  		cb(0,data,row);
  	});
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
              ,onViewportChanged:this.onViewportChanged
              ,selectedStyle:styles.selectedStyle
              ,selectedTextStyle:styles.selectedTextStyle
              ,markups:this.state.markups
              ,typedef:typedef
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