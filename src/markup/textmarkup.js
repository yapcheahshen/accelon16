/*fetch text and markup*/
var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;


var TextMarkup=React.createClass({
  contextTypes:{
    action:PT.func
    ,store: PT.object
    ,getter:PT.func
  }
  ,propTypes:{
  	db:PT.string.isRequired,
  	nfile:PT.number.isRequired,
  	q:PT.string,
  	name:PT.string,
  	uti:PT.string,
  	s:PT.number,
  	l:PT.number,
  	scrollTo:PT.string,
    fontSize:PT.number,
    isVisible:PT.func,
    component:PT.func.isRequired
  }
  ,getInitialState:function(){
    return {markups:[],rows:[],selections:{},ready:false};
  }
  ,componentDidMount:function(){
    this.load(); 
    this.context.store.listen("markupMember",this.markupMember,this);
    this.context.store.listen("markupChanged",this.onExternalMarkupChanged,this);
  }
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
  ,getRows:function(cb) {
    var getter=this.context.getter,db=this.props.db,nfile=this.props.nfile,q=this.props.q;
    getter("segments",{db,nfile},function(segments){
      getter("contents",{db, uti:segments, q},function(data){
        cb(data.map(function(d){return {uti:d.uti,text:d.text,hits:d.hits,tags:d.markups,vpos:d.vpos}}));
      });
    });
  }
  ,reload:function(){
    this.setState({ready:false});
    this.getRows(function(rows){
      var externalMarkups=this.context.getter("getMarkupByFile",{db:this.props.db,nfile:this.props.nfile});
      var markups=this.buildMarkups(externalMarkups,rows);
      var utis=rows.map(function(r){return r.uti});
      this.setState({rows,markups,ready:true});
    }.bind(this));    
  }
  ,load:function(){
    var db=this.props.db,nfile=this.props.nfile;
    this.getRows(function(rows){
      var {uti,s,l,scrollTo}=this.props;
      var externalMarkups=this.context.getter("getMarkupByFile",{db,nfile});
      if (scrollTo) {
        externalMarkups.push({uti:scrollTo,s,l,type:"flashhint",ttl:3000});
      }
      var markups=this.buildMarkups(externalMarkups,rows);
      var utis=rows.map(function(r){return uti});
      var member=this.context.getter("getMember",{db,nfile});
      var selections=this.member2selections(utis,member);
      this.setState({rows,markups,selections,member,ready:true});
    }.bind(this));    
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
    var db=this.props.db,nfile=this.props.nfile;
    var member=this.context.getter("getMember",{db,nfile});
    var utis=this.state.rows.map(function(r){return r.uti});
    var selections=this.member2selections(utis,member);

    var rows=this.dirtyRowBySelection(selections,this.state.selections);
    this.setState({rows,member,selections});
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
  ,onExternalMarkupChanged:function(affectedDB){
    var {db,nfile}=this.props.route;
    if (!affectedDB[db]) return;//not my business
    var externalMarkups=this.context.getter("getMarkupByFile",{db,nfile});
    var markups=this.buildMarkups(externalMarkups,this.state.rows);
    this.setState({markups});
  }
  ,buildSelections:function(selections){
    var out=[],db=this.props.db;
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
    var db=this.props.db,nfile=this.props.nfile;
    var selections=JSON.parse(JSON.stringify(this.state.selections));
    if (selections[opts.paragraph]) {
      selections[opts.paragraph].push([opts.selStart,opts.selLength,opts.text]);
    } else {  
      selections[opts.paragraph]=[[opts.selStart,opts.selLength,opts.text]];
    }
    this.setState({selections:selections});
    this.context.action("addSelections",
      {db,nfile,selections:this.buildSelections(selections)});
  } 
  ,render:function(){
    if (!this.state.ready) {
      return E(View,{},E(Text,null,"Loading"));
    }
    var {name,scrollTo,isVisible}=this.props;
    return E(this.props.component,{name,scrollTo,isVisible,db:this.props.db,
      reload:this.reload,markups:this.state.markups,selections:this.state.selections,
      onSelection:this.onSelection,rows:this.state.rows});
  }
});

module.exports=TextMarkup;