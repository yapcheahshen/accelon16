
var React=require("react-native");
var {
  View,Text,Image,StyleSheet
} =React;
var E=React.createElement;
var PT=React.PropTypes;

var DBSelector=require("./dbselector");

var Button=require("../components/button");
var Config=React.createClass({
	contextTypes:{
		action:PT.func.isRequired,
		store:PT.object.isRequired
	}
	,sampleMarkup:function(){
		this.context.action("sampleMarkup");
	}	
	,resetMarkup:function(){
		this.context.action("resetMarkup");
	}
	,componentDidMount:function(){
		//stupid design, as nav cannot call scene directly
		this.context.store.listen("selectTab.config",this.onConfigTab,this);
	}
	,componentWillUnmount:function(){
		this.context.store.unlistenAll();
	}
	,onConfigTab:function(){
		this.forceUpdate();
	}	
	,render:function(){
		return E(View,{flex:1,style:styles.container},
				 E(DBSelector),
				 E(Button,{onPress:this.sampleMarkup,text:"sample markup"}),
				E(Button,{onPress:this.resetMarkup,text:"delete all markup"})
				);
	}
});

var styles={
	container:{backgroundColor:'lightyellow'}
}

module.exports=Config;