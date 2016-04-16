var React=require("react-native");
var {
  View,Text,Image,TextInput,StyleSheet,TouchableHighlight
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var Search=React.createClass({
	propTypes:{
		tofindChanged:PT.func.isRequired
	}
	,getInitialState:function(){
		return {q:this.props.q};
	}
	,tofindChange:function(q){
		this.setState({q});
		var cb=this.props.tofindChanged;
		if (!cb)return;

		clearTimeout(this.timer);
		this.timer=setTimeout(function(){
			cb(q);
		},1000);
	}
	,componentWillReceiveProps:function(nextProps,nextState) {
		if (this.state.q!==nextProps.q) this.setState({q:nextProps.q});
	}
	,render:function(){
    	return E(View,null,
    		E(TextInput,{autoCorrect:false,clearButtonMode:'while-editing',autoCapitalize :"none",
    			style:{height:40,borderWidth:1,borderColor:'gray'},
    			onChangeText:this.tofindChange, value:this.state.q}
   	 ))
  }
})

module.exports=Search;