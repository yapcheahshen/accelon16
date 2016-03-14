var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var Member=require("./member");
var model=require("../model/member");

var Controls=require("./controls");
var MarkupEditor=React.createClass({
	contextTypes:{
		action:PT.func
		,store: PT.object
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
	,getInitialState:function(){
		var member=model.getMember();
		var firstMember=member.length?member[0].text:"noname";
		return {label:firstMember,member};
	}
	,render:function(){

		return E(View,{style:styles.container},
			E(Controls,{label:this.state.label,canAdd:this.state.member.length})
			,E(Member,{member:this.state.member})
			);
	}
});

var styles={
	container:{flex:1,backgroundColor:'rgb(240,240,240)'}
}
module.exports=MarkupEditor;