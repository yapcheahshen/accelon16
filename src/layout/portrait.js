var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform
} =React;

var TabNav=require("./tabnav");
var defaulttabs=require("./tabs");

var tabBarHeight=49;
var tabBorderWidth=1;
if (Platform.OS==="ios") {
	tabBorderWidth=0;
}

var Portrait=React.createClass({
	getInitialState:function(){
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
	,componentWillReceiveProps:function(nextProps){
		if (nextProps.fullscreen!==this.props.fullscreen){
			this.updateTab(this.state.selectedTab,nextProps.fullscreen);
		}
	}
	,renderTab:function(){
		if (this.state.tabBarHeight) {
			return (
				<View  style={{flex:this.state.panelFlex}} >
				<TabNav portrait={true} tabs={defaulttabs()} onTabSelected={this.onTabSelected}/>
				</View>
				);
		}
	}
	,render:function(){
		return 	(
			<View style={{flex:1}} >
			
			<View style={styles.maintext}><Text>Vasfsasadfasfsdf
					dfafdadfsadfadsfsadfsadsafd</Text></View>
			{this.renderTab()}
			</View>
		)
	}
	
});
var styles=StyleSheet.create({
	maintext:{backgroundColor:'blue',flex:6}
})	


module.exports=Portrait;