
var React=require("react-native");
var {
  View,Text,TextInput,Image,StyleSheet,TouchableOpacity,ListView,PixelRatio,LayoutAnimation
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var model=require("../model/bookmark");
var SwipeOut=require("react-native-swipeout");

var Controls=React.createClass({
	contextTypes:{
    	getter:PT.func
	}	
	,onPress:function(){
		model.addBookmark({db:this.props.db,uti:this.props.uti,text:this.state.label});
		this.props.onChanged();
	}
	,getInitialState:function(){
		return {label:this.props.uti};
	}
	,onChangeText:function(label){
		this.setState({label});
	}
	,componentWillReceiveProps:function(nextProps){
		this.setState({label:nextProps.uti});
	}
	,render:function(){
		var marginTop=this.props.landscape?15:0;
		var marginRight=this.props.landscape?50:5;
		var width=this.props.width-styles.labelInput.fontSize-marginRight-10;

		return E(View,{style:[styles.controls,{marginTop}]},
				E(TextInput,{style:[styles.labelInput,{width}],value:this.state.label,autoCorrect:false,
					onChangeText:this.onChangeText})
				,E(TouchableOpacity,{onPress:this.onPress},E(Text,{style:[styles.addbutton,{marginRight}]},"+"))
				
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
	,width:300
	,deleteBookmark:function(n){
		model.deleteBookmark(n);
		this.onChanged();
	}
	,row:[]
	,swipeoutBtns:function(id){return [
		{
			text:E(Image,{height:20,width:20,source:deleteButton}),
			onPress:this.deleteBookmark.bind(this,id)
		}	
	]}
	,getInitialState:function(){
		return this.context.getter("viewport");
	}
	,getBookmarks:function(){
		model.getBookmarks(function(rows){
			this.rows=rows;
			this._updateDataSource(rows);
		}.bind(this));
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
	,getInitialState:function(){
		var ds=new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});	
		return {dataSource:ds.cloneWithRows([])};
	}	
	,goBookmark:function(rowID){
		var row=this.rows[rowID];
		this.context.action("pushText",{db:row.db,uti:row.uti,replace:true});
	}
	//  set active swipeout item
	, _handleSwipeout: function(sectionID, rowID) {
		var rows=this.rows.slice();
		for (var i = 0; i < rows.length; i++) {
			var active=rows[i].active;
			if (i != rowID && rows[i].active) rows[i].active = false ;
			else if (!rows[i].active) rows[i].active = true ;
			if (rows[i].active!==active) {
				rows[i]=JSON.parse(JSON.stringify(rows[i]));
			}
		}
		this.rows=rows;
		this._updateDataSource(rows);
	}
	, _updateDataSource: function(data) {
		this.setState({
		  dataSource: this.state.dataSource.cloneWithRows(data)
		})
	}	
	, _allowScroll: function(scrollEnabled) {
	    this.setState({ scrollEnabled: scrollEnabled })
	}
	,renderRow:function(rowData,sectionID,rowID) {
		return E(View,{key:rowData.uti},
				E(SwipeOut,{left:this.swipeoutBtns(rowID),sectionID,rowID,close:!rowData.active,
					onOpen:(sectionID, rowID) => this._handleSwipeout(sectionID, rowID),
					scroll: event => this._allowScroll(event)},
				 E(Text,{style:styles.item,onPress:this.goBookmark.bind(this,rowID)},rowData.text||rowData.uti))
				,E(View,{style:styles.sep})
				);
	}
	,onChanged:function(){
		LayoutAnimation.spring();
		this.getBookmarks();
	}
	,render:function(){
		var landscape=this.context.getter("dimension").landscape;
		return E(View,{style:styles.container,flex:1,onLayout:this.onLayout},
				E(Controls,{...this.state,onChanged:this.onChanged,landscape,width:this.width}),
				E(ListView,{dataSource:this.state.dataSource,
					scrollEnabled:this.state.scrollEnabled,
					renderRow:this.renderRow})
			);
	}
});
var styles={
	controls:{alignItems:'flex-end',flexDirection:'row',justifyContent:'flex-end'},
	addbutton:{fontSize:38,color:'rgb(0,122,255)'},
	labelInput:{marginTop:12,marginRight:5,fontSize:24,borderRadius:5,
		borderColor:'rgb(128,128,128)',height:30,borderWidth:1/PixelRatio.get()},
	container:{backgroundColor:'rgb(240,240,240)'},
	item:{fontSize:20,margin:5,color:'rgb(0,122,255)'},
	sep:{height:1/PixelRatio.get(),backgroundColor:'rgb(192,192,192)'}
}
module.exports=Bookmark;