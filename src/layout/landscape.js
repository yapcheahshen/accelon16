var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform
} =React;


var TabNav=require("./tabnav");
var defaulttabs=require("./tabs");
var Screen=require("./screen");

var tabBarWidth=49;

var tabBorderWidth=1;
if (Platform.OS==="ios") {
	tabBorderWidth=0;
}

var Landscape=React.createClass({
	getInitialState:function(){
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
	,componentWillReceiveProps:function(nextProps){
		if (nextProps.fullscreen!==this.props.fullscreen){
			this.updateTab(this.state.selectedTab,nextProps.fullscreen);
		}
	}
	,renderTab:function(){
		if (this.state.tabBarWidth) {
			return (
				<View style={{flex:this.state.panelFlex}}><TabNav tabBarStyle={[styles.tabnav,
					{width:this.state.tabbarWidth,height:Screen.width}]}
				sceneStyle={styles.sceneStyle}
				landscape={true} tabs={defaulttabs()} onTabSelected={this.onTabSelected}/></View>
				);
		}
	}	
	,render:function(){
		return 	(
			<View style={{flex:1, flexDirection: 'row'}} >
			
					<View style={styles.maintext}><Text>Vasfsas adfasfsdf
					dfafda fsadfads fsadfsasf sfdasfas fasdfa sdfasdasdfs adfadsafd</Text></View>
				
			{this.renderTab()}
			</View>
		)
	}
});
var styles=StyleSheet.create({
	maintext:{backgroundColor:'blue',flex:6}
	,tabnav:{top:0,left:undefined,bottom:0,flexDirection:'column',alignItems:'center'}
})	,sceneStyle:{}

module.exports=Landscape;

