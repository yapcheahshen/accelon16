var React=require("react-native");
var {
  View,Text,Image,TextInput,StyleSheet,TouchableOpacity
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var MarkupList=React.createClass({
	contextTypes:{
		action:PT.func
	}
	,propTypes:{
		markups:PT.array.isRequired
	}
	,goText:function(i){
		var item=this.props.markups[i];
		this.context.action("jumpmarkup",item.id);
	}	
	,renderRow:function(row,idx){
		return E(TouchableOpacity ,{key:idx,onPress:this.goText.bind(this,idx)}
			,E(Text,{style:styles.item},row.text));
	}
	,render:function(){
		if (!this.props.markups.length) {
			return E(Text,{},"Markup not found");
		}
		return E(View,{},this.props.markups.map(this.renderRow));
	}
});
var styles={
	item:{fontSize:20,fontWeight:'200'}
}
module.exports=MarkupList;