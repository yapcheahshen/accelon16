var React=require("react-native");
var {
  View,Text,Image,ListView,StyleSheet,TouchableOpacity
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var Button=require("../components/button");

var MultiTarget=React.createClass({
	contextTypes:{
		getter:PT.func.isRequired
		,action:PT.func.isRequired
	}
	,propTypes:{
		fromtext:PT.string.isRequired,
		items:PT.array.isRequired
	}
	,runmarkup:function(mid){
		this.context.action("runmarkup",mid);
	}
	,renderRow:function(mid,key) {
		var m=this.context.getter("getMarkup",mid);
		if (m) m=(m.text||"").substr(0,10);
		else return null;

		return E(Text,{key,style:styles.link,onPress:this.runmarkup.bind(this,mid)},m);
	}
	,render:function(){
		return E(View,{style:{flex:1}},
			E(Text,{style:styles.source},this.props.fromtext,"→"),
			this.props.items.map(this.renderRow));
	}
});
var styles={
	sep:{margin:3,height:5,backgroundColor:"blue"}
	,button:{padding:10}
	,source:{fontSize:20,fontWeight:'300'}
	,link:{fontSize:24,fontWeight:'200',margin:5,color:'rgb(0,122,255)'}
}
module.exports=MultiTarget;