
var React = require('react-native');
var {
  PanResponder,
  StyleSheet,
  View,
  Text,
  Image,
  processColor,
  ScrollView,
  PropTypes
} = React;
var TabNavigator=require('react-native-tab-navigator').default;


var TabNav=React.createClass({
  propTypes:{
    onTabSelected:PropTypes.func
  }
  ,contextTypes:{
    action:PropTypes.func
  }
  ,getInitialState:function(){
    return {selectedTab:""};
  }
  ,selectTab:function(item,idx){
    var selected=(this.state.selectedTab==item.name)?"":item.name;
    this.setState({ selectedTab: selected  });
    this.props.onTabSelected&&this.props.onTabSelected(selected?item:'',selected?idx:-1);
    this.context.action("selectTab."+item.id,item); //if only need to listen to a specific tab
    this.context.action("selectTab",item); //list to all tab
  }
  ,renderTab:function(item,idx) {
    return  <TabNavigator.Item
    selected={this.state.selectedTab ===item.name}
    title={item.name} 
    key={idx}
    renderIcon={() => <Image style={{width:22,height:22}} source={item.icon} />}
    renderSelectedIcon={() => <Image style={{width:28,height:28}}
     source={item.selectedIcon||item.icon} />}
    badgeText={item.badgeText||""}
    onPress={()=>this.selectTab(item,idx)}>
    <View style={{flex:1}}>{item.component}</View>
    </TabNavigator.Item>
  }
  ,render:function(){
    return <TabNavigator tabBarStyle={this.props.tabBarStyle} 
    sceneStyle={this.props.sceneStyle}>{this.props.tabs.map(this.renderTab)}</TabNavigator>
  }
})
module.exports=TabNav;
//export default TabNav;