
var React = require('react-native');
var { StyleSheet, View, Text, Image } = React;
var PT=React.PropTypes;
var TabNavigator=require('react-native-tab-navigator').default;


var TabNav=React.createClass({
  propTypes:{
    onTabSelected:PT.func
    ,tabs:PT.array.isRequired
  }
  ,contextTypes:{
    action:PT.func
    ,store:PT.object
  }
  ,getInitialState:function(){
    return {selectedTab:""};
  }
  ,componentDidMount:function(){
    this.context.store.listen("setBadge",this.onSetBadge,this);
  }
  ,componentWillUnmount:function(){
    this.context.store.unlistenAll(this);
  }
  ,onSetBadge:function(opts){
    var dirty=false;
    for (var i=0;i<this.props.tabs.length;i+=1) {
      var tab=this.props.tabs[i];
      if (tab.id==opts.id) {
        tab.badgeText=opts.text;
        dirty=true;
      }
    }
    if (dirty) this.forceUpdate();
  }
  ,selectTab:function(item,idx){
    var selected=(this.state.selectedTab==item.name)?"":item.name;
    this.setState({ selectedTab: selected  });
    this.props.onTabSelected&&this.props.onTabSelected(selected?item:'',selected?idx:-1);
    if (selected) {
      this.context.action("selectTab."+item.id,item); //if only need to listen to a specific tab
      this.context.action("selectTab",item); //list to all tab      
    } else {
      this.context.action("unselectTab."+item.idx,item);
      this.context.action("unselectTab",item);
    }

  }
  ,renderTab:function(item,idx) {
    var onPress= item.onPress ||  this.selectTab.bind(this,item,idx) ;

    return  <TabNavigator.Item
    selected={this.state.selectedTab ===item.name}
    title={item.name} 
    key={idx}
    renderIcon={() => <Image style={{width:22,height:22}} source={item.icon} />}
    renderSelectedIcon={() => <Image style={{width:28,height:28}}
     source={item.selectedIcon||item.icon} />}
    badgeText={item.badgeText||""}
    onPress={onPress} >
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