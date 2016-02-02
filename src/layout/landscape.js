var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;


var TabNav=require("./tabnav");

var Screen=require("./screen");

var tabBarWidth=49;

var tabBorderWidth=1;
if (Platform.OS==="ios") {
	tabBorderWidth=0;
}

var Landscape=React.createClass({
	propTypes:{
		body:PropTypes.element.isRequired,
		menu:PropTypes.array.isRequired
	}
	,getInitialState:function(){
		return {tabBarWidth:tabBarWidth,panelFlex:0};
	}
	,updateTab:function(tab,fullscreen){
		LayoutAnimation.spring();
		if (!tab) {
			this.setState({panelFlex:0,selectedTab:tab,tabBarWidth:fullscreen?0:tabBarWidth});
		} else {
			this.setState({panelFlex:tab.flex,selectedTab:tab,tabBarWidth:fullscreen?0:tabBarWidth});
		}
	}
	,onTabSelected:function(tab){
		this.updateTab(tab,this.props.fullscreen);
	}
	,componentWillReceiveProps:function(nextProps,nextState){
		if (nextProps.fullscreen!==this.props.fullscreen){
			this.updateTab(this.state.selectedTab,nextProps.fullscreen);
		}
		if (nextProps.menu!==this.props.menu) {
			nextState.selectedTab=null;
		}
	}
	,renderTab:function(){
		if (this.state.tabBarWidth) {
			return (
				<View style={{flex:this.state.panelFlex}}><TabNav tabBarStyle={[styles.tabnav,
					{width:this.state.tabbarWidth,height:Screen.width}]}
				sceneStyle={styles.sceneStyle}
				landscape={true} tabs={this.props.menu} onTabSelected={this.onTabSelected}/></View>
				);
		}
	}	
	,render:function(){
		return 	(
			<View style={{flex:1, flexDirection: 'row'}} >
			<View style={{flex:6}}>{this.props.body}</View>
			{this.renderTab()}
			</View>
		)
	}
});
var styles=StyleSheet.create({
	maintext:{backgroundColor:'blue',flex:6}
	,sceneStyle:{backgroundColor:'gray',paddingBottom:0}
	,tabnav:{top:0,left:undefined,bottom:0,flexDirection:'column',alignItems:'center'}
})	

module.exports=Landscape;

