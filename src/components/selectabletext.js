var React=require("react-native");
var {
  View,Text,Image,StyleSheet,ScrollView,
  StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;
var E=React.createElement;
var Paragraph=require("./paragraph");
var SelectableText=React.createClass({
	propTypes:{
		onMode:PropTypes.func.isRequired
	}
	,getInitialState:function(){
		return {paraStart:-1,paraEnd:-1,token:null};
	}
	,onTouchStart:function(n,evt) {
		if (evt.nativeEvent.touches.length==1){
			if (this.state.paraStart===n && this.state.paraEnd===n) {
				this.cancelSelection();
			} else {
				this.setState({paraStart:n,paraEnd:n});
			}
		} else {
			this.setState({paraEnd:n});
		}
	}
	,cancelSelection:function(){
		this.setState({paraStart:-1,paraEnd:-1});
	}
	,trimSelection:function(para,start) {
		if (start) {
			this.setState({paraStart:para});
		} else {
			this.setState({paraEnd:para});
		}
	}
	,getSentenceMarkup:function(sid){
		console.log(this.prpos.markups,sid)
		return this.props.markups[sid];
	}
	,renderSentence:function(text,idx){
			return E(Paragraph,{key:idx
			,para:idx,text:text
			,markups:this.getSentenceMarkup(idx)
			,token:this.state.token
			,selectToken:this.selectToken 
			,paraStart:this.state.paraStart 
			,paraEnd:this.state.paraEnd
			,onTouchStart:this.onTouchStart.bind(this,idx)
			,trimSelection:this.trimSelection
			,cancelSelection:this.cancelSelection});
	}
	,render:function(){
		return E(ScrollView,null,this.props.texts.map(this.renderSentence));
	}
});

var styles=StyleSheet.create({
	paragraph:{fontSize:24},
	selectedParagraph:{backgroundColor:'lightyellow'}
})

module.exports=SelectableText;