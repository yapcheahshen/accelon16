var React=require("react-native");
var {
  View,Text,Image,ListView,StyleSheet,TouchableOpacity, Dimensions,LayoutAnimation
} =React;
var E=React.createElement;
var PT=React.PropTypes;

//TODO: handle orientation
var W=Dimensions.get("window").width;
var H=Dimensions.get("window").height;

var Button=require("../components/button");
var SelectMarkupPopupMenu=React.createClass({
	getInitialState: function() {
	  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	  return {
	    dataSource: ds.cloneWithRows(this.props.markups||[]),
	  };
	}
	,contextTypes:{
		action:PT.func,
		getter:PT.func
	}
	,propTypes:{
		markups:PT.array.isRequired,
		x:PT.number,
		y:PT.number,
	}
	,jumpmarkup:function(id){
		this.context.action("jumpmarkup",id);
	}
	,jumptarget:function(id) {
		this.context.action("jumptarget",id);
	}
	,renderTargetLink:function(id,text,target)  {
		var text,onPress;
		if (typeof target==="string") {
			var m=this.context.getter("getMarkup",target);
			text=m.text;
			onPress=this.jumpmarkup.bind(this,target);
		} else if (target instanceof Array) {
			text=target.length+" targets";
			onPress=this.jumptarget.bind(this,{id,px:this.props.x,py:this.props.y});
		}
		return E(Button,{textStyle:styles.target,onPress,text:text});
	}
	,renderRow:function(rowData,col,idx){
		var target=this.renderTargetLink(rowData.id,rowData.text,rowData.target);

		return E(View,{style:styles.child},
				E(Text,{style:[styles.item] },
					rowData.text.substr(0,5),'→'),target
			);
	}
	,render:function(){
  		return E(View,{style:styles.popup},
  			E(ListView,{styles:styles.children,dataSource:this.state.dataSource, 
  				renderRow:this.renderRow})
  			);
	}
});
var styles=StyleSheet.create({
	popup:{width:W-40,overflow:'hidden'} //deduct size of landscape tabbar at the right
	,children:{margin:5,flexDirection:'column'}
	,now:{backgroundColor:'rgb(192,192,192)',borderRadius:10}
	,item:{fontSize:24,fontWeight:'300'}
	,target:{fontSize:20,fontWeight:'200'}
	,selectedItem:{backgroundColor:'rgb(192,216,255)'}
	,selectableItem:{color:'rgb(0,122,255)'}
	,child:{flexDirection:'row'}
});
module.exports=SelectMarkupPopupMenu;