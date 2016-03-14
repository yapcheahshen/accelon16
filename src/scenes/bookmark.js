
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
		var landscape=this.context.getter("dimension").landscape;		
		var marginTop=landscape?15:0;
		var marginRight=landscape?50:5;
		return E(View,{style:[styles.controls,{marginTop}]},
				E(TouchableOpacity,{onPress:this.onPress},E(Text,{style:styles.addbutton},"+"))
				,E(TextInput,{clearButtonMode:'while-editing',
					style:[styles.labelInput,{marginRight}],value:this.state.label,autoCorrect:false,
					onChangeText:this.onChangeText})
				
				
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
		return this.context.getter("viewport");
	}	
	,width:300
	,deleteBookmark:function(n){
		model.deleteBookmark(n);
		this.onChanged();
	}
	,rows:[]

	,getBookmarks:function(){
		model.getBookmarks(function(rows){
			this.rows=rows;
			this.forceUpdate();
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
		return 	E(Text,{onPress:this.goBookmark.bind(this,rowId)
				 ,style:styles.item},rowData.text||rowData.uti);
	}
	,onChanged:function(){
		LayoutAnimation.spring();
		this.getBookmarks();
	}
	,render:function(){

		var separator=E(View,{style:styles.sep});
		return E(View,{style:styles.container,flex:1,onLayout:this.onLayout},
				E(Controls,{...this.state,onChanged:this.onChanged,width:this.width}),
				E(SwipableListView,{rows:this.rows,	renderRow:this.renderRow 
								, separator, getButtons:this.getButtons})
			);
	}
});
var styles={
	controls:{alignItems:'flex-end',flexDirection:'row',justifyContent:'flex-end'},
	addbutton:{marginLeft:5,fontSize:38,color:'rgb(0,122,255)'},
	labelInput:{flex:1,marginLeft:5,marginTop:12,marginRight:5,fontSize:24,borderRadius:5,
		borderColor:'rgb(128,128,128)',height:30,borderWidth:1/PixelRatio.get()},
	container:{backgroundColor:'rgb(240,240,240)'},
	item:{fontSize:20,margin:5,color:'rgb(0,122,255)'},
	sep:{height:1/PixelRatio.get(),backgroundColor:'rgb(192,192,192)'}
}
module.exports=Bookmark;