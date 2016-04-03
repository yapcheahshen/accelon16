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
		this.context.action("pushText",{uti:item.uti,s:item.s,l:item.l,db:item.db,replace:true});
	}	
	,renderRow:function(row,idx){
		return E(TouchableOpacity ,{key:idx,onPress:this.goText.bind(this,idx)}
			,E(Text,{style:styles.item},row.label));
	}
	,render:function(){
		return E(View,{},this.props.markups.map(this.renderRow));
	}
});
var styles={
	item:{fontSize:20,fontWeight:'200'}
}
module.exports=MarkupList;