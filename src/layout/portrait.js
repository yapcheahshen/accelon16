var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;

var TabNav=require("./tabnav");

var tabBarHeight=49;
var tabBorderWidth=1;
if (Platform.OS==="ios") {
	tabBorderWidth=0;
}

var Portrait=React.createClass({
	propTypes:{
		body:PropTypes.element.isRequired,
		menu:PropTypes.array.isRequired
	}	
	,getInitialState:function(){
		return {panelFlex:0,tabBarHeight:tabBarHeight};
	}
	,updateTab:function(tab,fullscreen){
		LayoutAnimation.spring();
		if (fullscreen)tab=null;
		if (!tab) {
			this.setState({panelFlex:0,selectedTab:tab,tabBarHeight:fullscreen?0:tabBarHeight});
		} else {
			this.setState({panelFlex:tab.flex,selectedTab:tab,tabBarHeight:fullscreen?0:tabBarHeight});
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
			this.setState({selectedTab:null});
		}		
	}
	,renderTab:function(){
		if (this.state.tabBarHeight) {
			return (
				<View style={[styles.panelStyle,{flex:this.state.panelFlex}]} >
				<TabNav tabBarStyle={styles.tabBarStyle}
				portrait={true} tabs={this.props.menu} onTabSelected={this.onTabSelected}/>
				</View>
				);
		}
	}
	,render:function(){
		return 	(
			<View style={{flex:1}}>
			<View style={{flex:6}}>{this.props.body}</View>
			{this.renderTab()}
			</View>
		)
	}
	
});
var styles=StyleSheet.create({
	tabBarStyle:{}
	,panelStyle:{opacity:0.8}
	,sceneStyle:{backgroundColor:'gray'}
})	


module.exports=Portrait;