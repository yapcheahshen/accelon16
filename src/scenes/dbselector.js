
var React=require("react-native");
var {
  View,Text,TextInput,Image,StyleSheet,TouchableOpacity,PixelRatio,LayoutAnimation
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var Button=require("../components/button");

var databases=[
	["ds","金剛經經文"],
	["dsl_jwn","江味農金剛經講記"],
	["mpps","大智度論"]
]

var DBSelector=React.createClass({
	contextTypes:{
		getter:PT.func.isRequired,
		action:PT.func.isRequired
	}
	,selectdb:function(idx){
		var db=databases[idx][0];
		this.context.getter("segments",{db,nfile:1},function(data){
			var route={id:"root",db,nfile:1, defaultuti:data[0], replaceCamp:true};		
			this.context.action("pushText",route);	
		}.bind(this));
		this.context.action("dismissTab");
	}
	,renderItem:function(db,key){
		var seldb=this.context.getter("db");
		var onPress=seldb==db[0]?null:this.selectdb.bind(this,key);
		var style=seldb==db[0]?styles.selected:styles.selectable;
		return E(TouchableOpacity,{key,onPress}
			,E(Text,{style:[styles.db,style]},db[1]));
	}
	,render:function(){
		return E(View,{flex:1},
			E(Text,{},"Select DB"),
			databases.map(this.renderItem));
	}

});
var styles={
	db:{fontSize:24,margin:5},
	selected:{backgroundColor:'rgb(127,127,127)'},
	selectable:{color:'rgb(0,122,255)'},

}
module.exports=DBSelector;