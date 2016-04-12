var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var Member=require("./member");
var model=require("../model/member");
var markupstore=require("../model/markup");

var Controls=require("./controls");
var Help=require("./help");

var MarkupEditor=React.createClass({
	contextTypes:{
		store: PT.object,
		action:PT.func
	}	
	,componentDidMount:function(){
		this.context.store.listen("markupMember",this.markupMember,this);
	}
	,componentWillUnmount:function(){
		this.context.store.unlistenAll(this);
	}
	,markupMember:function(member) {
		this.setState({member});
	}	
	,getInitialState:function(){
		var member=model.getMember();
		var firstMember=member.length?member[0].text:"noname";
		return {label:firstMember,member};
	}
	,createMarkup:function(){
		markupstore.add({label:this.state.label,member:this.state.member});
		model.clear();
		this.context.action("dismissTab");
		this.setState({label:""});
	}
	,setLabel:function(label) {
		this.setState({label});
	}
	,render:function(){
		var M=this.state.member;

		return E(View,{style:styles.container},
			E(Controls,{label:this.state.label,canAdd:M.length
				,setLabel:this.setLabel,createMarkup:this.createMarkup})
			,E( M.length?Member:Help,{member:M})
			);
	}
});

var styles={
	container:{flex:1,backgroundColor:'rgb(240,240,240)'}
}
module.exports=MarkupEditor;