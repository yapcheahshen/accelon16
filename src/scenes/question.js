
var React=require("react-native");
var {
  View,Text,TextInput,Image,StyleSheet,TouchableOpacity,PixelRatio,LayoutAnimation
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var model=require("../model/question");
var SwipableListView=require("../components/swipablelistview");

var Controls=React.createClass({
	contextTypes:{
    	getter:PT.func
	}
	,propTypes:{
		addQuestion:PT.func.isRequired,
		setQuestion:PT.func.isRequired,
		onTextChanged:PT.func
	}
	,addQuestion:function(){
		this.props.addQuestion(this.state.text);
	}
	,setQuestion:function(){
		this.props.setQuestion(this.state.text);
	}
	,getInitialState:function(){
		return {text:this.props.text};
	}
	,onChangeText:function(text){
		this.setState({text});
		if (!this.props.onTextChanged);
		clearTimeout(this.timer);
		this.timer=setTimeout(function(){
			this.props.onTextChanged(text);
		}.bind(this),500);
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
			saveButton=E(TouchableOpacity,{onPress:this.setQuestion}
			,E(Text,{style:styles.setbutton},"Done"));
			clearButtonMode="never";
			marginRight=5;
		} else if (this.props.adding && this.state.text) {
			button=E(TouchableOpacity,{onPress:this.addQuestion}
			,E(Text,{style:styles.addbutton},"+"));
			clearButtonMode='while-editing';
		}

		return E(View,{style:[styles.controls,{marginTop}]}
				,button
				,E(TextInput,{clearButtonMode,
					style:[styles.labelInput,{marginRight}],value:this.state.text,
					placeholder:"Type a Question",
					autoCorrect:false,autoCapitalize :'none',
					onChangeText:this.onChangeText})
				,saveButton
				
			);
	}
});
var deleteButton=require("../../images/delete.png");

var Question=React.createClass({
	contextTypes:{
    	action:PT.func
    	,store: PT.object
    	,getter:PT.func
	}
	,getInitialState:function(){
		var s=this.context.getter("viewport"); //get db, uti
		s.editing=-1;
		s.q="";
		return s;
	}	
	,width:300
	,deleteQuestion:function(n){
		model.deleteQuestion(n);
		this.setState({editing:-1,q:""});
		this.onChanged();
	}
	,rows:[]
	,getQuestions:function(){
		model.getQuestions(function(rows){
			this.rows=rows;
			this.forceUpdate();
		}.bind(this));
	}
	,onTextChanged:function(text){
		if (this.state.editing==-1) {
			this.setState({q:text});			
		}
	}
	,addQuestion:function(text){
		model.addQuestion({db:this.state.db,uti:this.state.uti,text});
		this.setState({editing:-1,q:""});
		this.onChanged();
	}
	,setQuestion:function(text){
		model.setQuestion(this.state.editing,{db:this.state.db,uti:this.state.uti,text});
		this.setState({editing:-1,q:""});
		this.onChanged();
	}
	,onLayout:function(event){
		var layout=event.nativeEvent.layout;
		this.width=layout.width;
	}
	,componentDidMount:function(){
		this.getQuestions();
		this.context.store.listen("viewport",this.viewport,this);
	}
	,componentWillUnmount:function(){
		this.context.store.unlistenAll(this);
	}
	,viewport:function(opts){
		if (opts) this.setState(opts);
	}
	,goQuestion:function(rowID){
		var row=this.rows[rowID];
		this.context.action("pushText",{db:row.db,uti:row.uti,replace:true});
	}
	,getButtons:function(rowData,sectionId,rowId){
		return [{text:E(Image,{height:20,width:20,source:deleteButton}),
				 onPress:this.deleteQuestion.bind(this,rowId)
				}];	
	}
	,renderRow:function(rowData,sectionId,rowId) {
		var active=rowData.active;
		var onPress=active?null:this.goQuestion.bind(this,rowId);
		var clickable=active?null:{color:'rgb(0,122,255)'};
		return 	E(Text,{onPress,style:[styles.item,clickable]},
				 rowData.text||rowData.uti);
	}
	,onChanged:function(){
		LayoutAnimation.spring();
		this.getQuestions();
	}
	,onEditRow:function(n){
		this.editing=parseInt(n);
		this.setState({editing:parseInt(n)});
	}	
	,onEditDone:function(n) {
		n=parseInt(n);
		if (n>-1) this.rows[n].active=false;
		this.setState({editing:-1,q:""});
	}
	,filteredRows:function(){
		var q=this.state.q;
		if (!q) return this.rows;
		return this.rows.filter(function(r){
			return r.text.indexOf(q)>-1;
		});
	}
	,addingMessage:function(){
		return E(Text,{style:styles.addingMessage},"Answer of question:\n",this.state.uti);
	}
	,render:function(){
		var separator=E(View,{style:styles.sep});
		var rows=this.filteredRows();
		var text=(this.state.editing>-1&&this.state.editing<rows.length)?
			rows[this.state.editing].text:this.state.q;
		var adding=rows.length==0 && this.state.q;
		return E(View,{style:styles.container,flex:1,onLayout:this.onLayout},
				E(Controls,{adding,text,width:this.width,editing:this.state.editing,
					setQuestion:this.setQuestion,addQuestion:this.addQuestion,
					onTextChanged:this.onTextChanged,
				})
				,adding?this.addingMessage():null
				,E(SwipableListView,{rows,renderRow:this.renderRow 
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
	sep:{height:1/PixelRatio.get(),backgroundColor:'rgb(192,192,192)'},
	addingMessage:{fontSize:24}
}
module.exports=Question;