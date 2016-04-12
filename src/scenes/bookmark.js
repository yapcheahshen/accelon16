
var React=require("react-native");
var {
  View,Text,TextInput,Image,StyleSheet,TouchableOpacity,PixelRatio,LayoutAnimation
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var model=require("../model/bookmark");
var SwipableListView=require("../components/swipablelistview");

var Controls=React.createClass({
	contextTypes:{
    	getter:PT.func
	}
	,propTypes:{
		addBookmark:PT.func.isRequired,
		setBookmark:PT.func.isRequired
	}
	,addBookmark:function(){
		this.props.addBookmark(this.state.text);
	}
	,setBookmark:function(){
		this.props.setBookmark(this.state.text);
	}
	,getInitialState:function(){
		return {text:this.props.text};
	}
	,onChangeText:function(text){
		this.setState({text});
	}
	,componentWillReceiveProps:function(nextProps){
		this.setState({text:nextProps.text});
	}
	,render:function(){
		var landscape=this.context.getter("dimension").landscape;		
		var marginTop=landscape?15:0;
		var marginRight=landscape?50:5;
		var button,saveButton,clearButtonMode;
		if (this.props.editing>-1) {
			saveButton=E(TouchableOpacity,{onPress:this.setBookmark}
			,E(Text,{style:styles.setbutton},"Done"));
			clearButtonMode="never";
		} else {
			button=E(TouchableOpacity,{onPress:this.addBookmark}
			,E(Text,{style:styles.addbutton},"+"));
			clearButtonMode='while-editing';
		}

		return E(View,{style:[styles.controls,{marginTop}]}
				,button
				,E(TextInput,{clearButtonMode,
					style:[styles.labelInput,{marginRight}],value:this.state.text,
					autoCorrect:false,autoCapitalize :'none',
					onChangeText:this.onChangeText})
				,saveButton
				
			);
	}
});
var deleteButton=require("../../images/delete.png");

var Bookmark=React.createClass({
	contextTypes:{
    	action:PT.func
    	,store: PT.object
    	,getter:PT.func
	}
	,getInitialState:function(){
		var s=this.context.getter("viewport"); //get db, uti
		s.editing=-1;
		return s;
	}	
	,width:300
	,deleteBookmark:function(n){
		model.deleteBookmark(n);
		this.setState({editing:-1,q:""});
		this.onChanged();
	}
	,rows:[]
	,getBookmarks:function(){
		model.getBookmarks(function(rows){
			this.rows=rows;
			this.forceUpdate();
		}.bind(this));
	}
	,addBookmark:function(text){
		model.addBookmark({db:this.state.db,uti:this.state.uti,text});
		this.setState({editing:-1});
		this.onChanged();
	}
	,setBookmark:function(text){
		model.setBookmark(this.state.editing,{db:this.state.db,uti:this.state.uti,text});
		this.setState({editing:-1});
		this.onChanged();
	}
	,onLayout:function(event){
		var layout=event.nativeEvent.layout;
		this.width=layout.width;
	}
	,componentDidMount:function(){
		this.getBookmarks();
		this.context.store.listen("viewport",this.viewport,this);
	}
	,componentWillUnmount:function(){
		this.context.store.unlistenAll(this);
	}
	,viewport:function(opts){
		if (opts) this.setState(opts);
	}
	,goBookmark:function(rowID){
		var row=this.rows[rowID];
		this.context.action("pushText",{db:row.db,uti:row.uti,replace:true});
	}
	,getButtons:function(rowData,sectionId,rowId){
		return [{text:E(Image,{height:20,width:20,source:deleteButton}),
				 onPress:this.deleteBookmark.bind(this,rowId)
				}];	
	}
	,renderRow:function(rowData,sectionId,rowId) {
		var active=rowData.active;
		var onPress=active?null:this.goBookmark.bind(this,rowId);
		var clickable=active?null:{color:'rgb(0,122,255)'};
		return 	E(Text,{onPress,style:[styles.item,clickable]},
				 rowData.text||rowData.uti);
	}
	,onChanged:function(){
		LayoutAnimation.spring();
		this.getBookmarks();
	}
	,onEditRow:function(n){
		this.editing=parseInt(n);
		this.setState({editing:parseInt(n)});
	}	
	,onEditDone:function(n) {
		n=parseInt(n);
		if (n>-1) this.rows[n].active=false;
		this.setState({editing:-1});
	}
	,render:function(){
		var text=this.state.editing>-1?this.rows[this.state.editing].text:this.state.uti;
		var separator=E(View,{style:styles.sep});
		return E(View,{style:styles.container,flex:1,onLayout:this.onLayout},
				E(Controls,{setBookmark:this.setBookmark,addBookmark:this.addBookmark,
					text,
					width:this.width,editing:this.state.editing}),
				E(SwipableListView,{rows:this.rows,	renderRow:this.renderRow 
						, onEditRow:this.onEditRow, onEditDone:this.onEditDone
								, separator, getButtons:this.getButtons})
			);
	}
});
var styles={
	controls:{alignItems:'flex-end',flexDirection:'row',justifyContent:'flex-end'},
	addbutton:{marginLeft:5,fontSize:30,color:'rgb(0,122,255)'},
	setbutton:{marginLeft:5,marginBottom:5,fontSize:20,color:'rgb(0,122,255)'},
	labelInput:{flex:1,marginLeft:5,marginTop:12,marginRight:5,fontSize:24,borderRadius:5,
		borderColor:'rgb(128,128,128)',height:30,borderWidth:1/PixelRatio.get()},
	container:{backgroundColor:'rgb(240,240,240)'},
	item:{fontSize:20,margin:5,color:'rgb(128,128,128)'},
	sep:{height:1/PixelRatio.get(),backgroundColor:'rgb(192,192,192)'}
}
module.exports=Bookmark;