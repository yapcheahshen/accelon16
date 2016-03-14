var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var SwipableListView=require("../components/swipablelistview");
var model=require("../model/member");
var deleteButton=require("../../images/delete.png");
var MarkupMember=React.createClass({
	contextTypes:{
		action:PT.func
		,store: PT.object
	}
	,getInitialState:function(){
		return {member:model.getMember()};
	}
	,componentDidMount:function(){
		this.context.store.listen("markupMember",this.markupMember,this);
	}
	,componentWillUnmount:function(){
		this.context.store.unlistenAll("markupMember");
	}
	,markupMember:function(member) {
		this.setState({member});
	}
	,deleteMember:function(rowId){
		model.remove(rowId);
	}
	,goMember:function(rowId){
		var sel=this.state.member[rowId];
		this.context.action("pushText",sel);
	}
	,getButtons:function(rowData,sectionId,rowId){
		return [{text:E(Image,{height:20,width:20,source:deleteButton}),
				 onPress:this.deleteMember.bind(this,rowId)
				}];	
	}

	,renderRow:function(rowData,sectionId,rowId) {
		return 	E(Text,{onPress:this.goMember.bind(this,rowId)
				 ,style:styles.item},rowData.text||rowData.uti);
	}
	,render:function(){
		return E(SwipableListView,{renderRow:this.renderRow,
			getButtons:this.getButtons,rows:this.state.member})
	}
});
var styles={
	item:{fontSize:32,margin:5,color:'rgb(0,122,255)'}
}
module.exports=MarkupMember;