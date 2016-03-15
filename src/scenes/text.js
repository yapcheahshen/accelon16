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

var TextScene=React.createClass({
  contextTypes:{
    action:PT.func
    ,store: PT.object
    ,getter:PT.func
    ,registerGetter:PT.func
    ,unregisterGetter:PT.func
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
    var first=M[markups[0]];

    //TODO , handle multiple markup on same position
    var target=this.context.getter("getMarkup",{id:first.target});
    if (!target && first.type==="head") {
      return E(TOCPopupMenu,{popupX:3,type:"head",vpos:first.vpos,db:this.props.route.db});
    }
    if (target) {
      var db=target.db||this.props.route.db ;
      this.context.action("pushText",{db , uti:target.uti , s:target.s, l:target.l }); 
    }

  }
  ,onSetTextRange:function(rowid,sel){

  }
  ,viewportStart:0
  ,viewportEnd:0
  ,onViewport:function(start,end) {
    if (this.viewportStart!==start||this.viewportEnd!==end) {
      this.viewportStart=start;
      this.viewportEnd=end;
      this.context.action("viewport",this.getViewPort());      
    }
  }
  ,getViewPort:function(){
    if (this.props.route.index!==this.props.navigator.getCurrentRoutes().length-1) return null ; //foreground only
    return {db:this.props.route.db,uti:this.state.rows[this.viewportStart].uti
    ,start:this.viewportStart,end:this.viewportEnd};
  }
  //,shouldComponentUpdate:function(nextProps,nextState){
  //  return nextState.rows != this.state.rows ;
  //}
  ,hits2markups:function(markups,rows){
    var hits,nhit=0,i,j;
    for (i=0;i<rows.length;i+=1) {
      hits=rows[i].hits;
      if (!hits || !hits.length) continue;
      if (!markups[i]) markups[i]=[];
      for (j=0;j<hits.length;j+=1) {
        var hit=hits[j];
        markups[i]["h"+nhit]={s:hit[0],l:hit[1],type:"hl"};
        nhit+=1;
      }
    }
    return markups;
  }
  ,tag2markups:function(rows){ //convert kdb internal tag format to markup format
    var markups=[],ntag=0;
    for (var i=0;i<rows.length;i+=1) {
      var tags=rows[i].tags;
      for (var tag in tags) {
        var T=tags[tag];
        if (!T.texts.length) break;

        for (var j=0;j<T.texts.length;j+=1) {
          if (!markups[i]) markups[i]=[];
          var p=T.realpos[j];
          var vpos=T.vpos[j][0]+T.vpos[j][1]; //end of tag
          markups[i][ tag+ntag ] = {s:p[0], l :p[1], type:tag ,vpos};
          ntag++;
        }
      }
    }
    return markups;
  }
  ,combineMarkups:function(M1,M2) {
    if (!M1.length) return M2;
    if (!M2.length) return M1;
    var o=[];
    for (var i=0;i<M1.length;i+=1) {
      if (M1[i]) o[i]=M1[i];
    }
    for (var i=0;i<M2.length;i+=1) {
      if (!M2[i]) continue;
      if (!o[i]) o[i]=M2[i];
      else {
        for (var j in M2[i]) o[i][j] = M2[i][j];
      }
    }
    return o;
  }
  ,buildMarkups:function(rawmarkups,rows){
    var markups=[];
    var segments=rows.map(function(r){return r.uti});
    for (var i=0;i<rawmarkups.length;i+=1) {
      var j=segments.indexOf( rawmarkups[i].uti );
      if (j>-1) {
        if (!markups[j]) markups[j]=[];
        markups[j].push(rawmarkups[i]);
      } else {
        //console.warn("segment id "+m+" not found");
      }
    }

    var externals=this.hits2markups(markups,rows);
    var internals=this.tag2markups(rows);

    return this.combineMarkups(internals,externals);
  }
  ,member2selections:function(utis,member){
    member=member||this.state.member;
    var selections={};
    for (var i=0;i<member.length;i+=1) {
      var m=member[i];
      var paragraph=utis.indexOf(m.uti);
      if (paragraph>-1) {
        if (!selections[paragraph]) selections[paragraph]=[];
        selections[paragraph].push([m.s,m.l,m.text]);
      }
    }
    return selections;
  }
  ,componentWillReceiveProps:function(nextProps,nextState){
    if (nextProps.route!==this.props.route) {
      this.getRows(function(rows){
        var markups=this.buildMarkups(nextProps.route.markups||{},rows);
        var utis=rows.map(function(r){return r.uti});
        this.setState({rows,markups});
      }.bind(this));
    }
  }
  ,getRows:function(cb) {
    var getter=this.context.getter,db=this.props.route.db,nfile=this.props.route.nfile,q=this.props.route.q;
    getter("segments",{db,nfile},function(segments){
      getter("contents",{db, uti:segments, q},function(data){
        cb(data.map(function(d){return {uti:d.uti,text:d.text,hits:d.hits,tags:d.markups,vpos:d.vpos}}));
      });
    });
  }
  ,componentDidMount:function(){
    this.getRows(function(rows){
      var markups=this.buildMarkups(this.props.route.markups||[],rows);
      var utis=rows.map(function(r){return r.uti});
      var member=this.context.getter("getMember",{db:this.props.route.db,nfile:this.props.route.nfile});
      var selections=this.member2selections(utis,member);
      this.setState({rows,markups,selections,member,ready:true});
    }.bind(this));

    this.context.store.listen("scrollToUti",this.scrollToUti,this);
    this.context.store.listen("showToc",this.showToc,this);
    this.context.store.listen("markupMember",this.markupMember,this);

    this.context.registerGetter("viewport",this.getViewPort,{overwrite:true});
  }
  ,componentDidUpdate:function(){
    this.context.registerGetter("viewport",this.getViewPort,{overwrite:true});
  }
  ,componentWillUnmount:function(){
    this.context.unregisterGetter("viewport");
    this.context.store.unlistenAll(this);
  }
  ,dirtyRowBySelection:function(newsel,oldsel) {
    var rows=this.state.rows.slice(),i;
 
    var dirty={};
    //stupid check
    for (i in newsel) if (JSON.stringify(newsel[i])!==JSON.stringify(oldsel[i])) dirty[i]=true;
    for (i in oldsel) if (JSON.stringify(newsel[i])!==JSON.stringify(oldsel[i])) dirty[i]=true;

    for (i in dirty) {
      rows[i]=JSON.parse(JSON.stringify(rows[i]));
    }

    return rows;
  }
  ,markupMember:function(member) {
    var member=this.context.getter("getMember",{db:this.props.route.db,nfile:this.props.route.nfile});
    var utis=this.state.rows.map(function(r){return r.uti});
    var selections=this.member2selections(utis,member);

    var rows=this.dirtyRowBySelection(selections,this.state.selections);
    this.setState({rows,member,selections});
  }
  ,showToc:function(opts){
    if (this.props.route.index!==this.props.navigator.getCurrentRoutes().length-1) return ; //foreground only
    if (!opts || !opts.popup)return;
    var selecting=this.context.getter("selectedParagraph");
    if (!this.state.rows[selecting])return;
    if (selecting<this.state.rows.length-1) selecting+=1; //vpos of next selecting paragraph
    var vpos=this.state.rows[selecting].vpos; 
    
    var popup= E(opts.popup,{popupX:3,type:"head",vpos , db:this.props.route.db});
    this.context.action("showTocPopup",{popup});
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
  ,buildSelections:function(selections){
    var out=[],db=this.props.route.db;
    for (var row in selections) {
      var uti=this.state.rows[row].uti;
      for (var i=0;i<selections[row].length;i+=1){
        var s=selections[row][i][0];
        var l=selections[row][i][1];
        var text=selections[row][i][2];
        out.push({db,uti:uti, s,l,text});
      }
    }
    return out;
  }
  ,onSelection:function(opts){
    var selections=JSON.parse(JSON.stringify(this.state.selections));
    if (selections[opts.paragraph]) {
      selections[opts.paragraph].push([opts.selStart,opts.selLength,opts.text]);
    } else {  
      selections[opts.paragraph]=[[opts.selStart,opts.selLength,opts.text]];
    }
    this.setState({selections:selections});
    this.context.action("addSelections",
      {db:this.props.route.db,nfile:this.props.route.nfile,selections:this.buildSelections(selections)});
  }
  ,onSelectToken:function(opts){
    this.context.action("selectingToken",opts);
  }
  ,onSelectParagraph:function(n) {
    this.context.action("selectingParagraph",n);
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
              ,popup:E(RichTextPopupMenu)
              ,onSelectToken:this.onSelectToken
              ,onSelectParagraph:this.onSelectParagraph})
 	      );
  }

});
var styles=StyleSheet.create({
  textStyle:{fontSize:28},
  selectedStyle:{},
  selectedTextStyle:{}
})
module.exports=TextScene;