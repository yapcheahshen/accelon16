var React=require("react-native");
var {
	View,Text,Image,StyleSheet,
	StatusBarIOS,Dimensions,
	LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;


var TabNav=require("./tabnav");

var Screen=require("./screen");

var tabBarWidth=39;

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
			this.setState({selectedTab:null});
		}
	}
	,paddingBottom:function(){
		 //because Tab.js use justifyContent: 'flex-end', adjust by using paddingBottom
		return Screen.width / (this.props.menu.length*2 ) - (39/this.props.menu.length) ;
	}
	,bodyPaddingRight:function(){
		return this.state.tabBarWidth;
	}
	,renderTab:function(){
		if (this.state.tabBarWidth) {
			var unit=Screen.width/12;
			return (
				<View style={[styles.panelStyle,{height:Screen.height,
					width:this.state.panelFlex*unit+this.state.tabBarWidth}]}>
				<TabNav tabBarStyle={[styles.tabnav,
					{width:this.state.tabBarWidth,height:Screen.width,
						paddingBottom:this.paddingBottom()}]}
				sceneStyle={styles.sceneStyle}
				landscape={true} tabs={this.props.menu} onTabSelected={this.onTabSelected}/>
				</View>
				);
		}
	}	
	,render:function(){
		return 	(
			<View style={{flex:1, flexDirection: 'row'}} >
			
			<View style={{flex:6,paddingRight:this.bodyPaddingRight()}}>{this.props.body}</View>
			{this.renderTab()}
			</View>
		)
	}
});
var styles=StyleSheet.create({
	panelStyle:{position:'absolute',right:0, opacity:0.9}
	,sceneStyle:{backgroundColor:'gray',paddingBottom:0}
	,tabnav:{top:0,left:null,flexDirection:'column',
		alignItems:'center'}
})	

module.exports=Landscape;

