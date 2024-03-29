
var React = require('react-native');
var { StyleSheet, View, Text, Image } = React;
var PT=React.PropTypes;
var TabNavigator=require('react-native-tab-navigator').default;
var BadgeText=require("../model/badgetext");
var markupMember=require("../model/member"); //need to load first

var TabNav=React.createClass({
  propTypes:{
    onTabSelected:PT.func
    ,tabs:PT.array.isRequired
  }
  ,contextTypes:{
    action:PT.func
    ,store:PT.object
    ,registerGetter:PT.func
    ,unregisterGetter:PT.func
  }
  ,getInitialState:function(){
    return {selectedTab:""};
  }
  ,componentDidMount:function(){
    this.context.registerGetter("selectedTab",this.getSelectedTab,{overwrite:true});
    this.context.store.listen("setBadge",this.onSetBadge,this);
    this.context.store.listen("dismissTab",this.onDismissTab,this);
  }
  ,componentWillUnmount:function(){
    this.context.unregisterGetter("selectedTab");
    this.context.store.unlistenAll(this);
  }
  ,selectedTab:null
  ,getSelectedTab:function(){
    return this.selectedTab;
  }
  ,onDismissTab:function(){
    if (this.selectedTab) {
      this.selectTab(this.selectedTab);
    }
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
  ,selectTab:function(item){
    var selected=(this.state.selectedTab==item.id)?"":item.id;

    this.props.onTabSelected&&this.props.onTabSelected(selected?item:'',selected?item.idx:-1);
    if (selected) {
      this.context.action("selectTab."+item.id,item); //if only need to listen to a specific tab
      this.context.action("selectTab",item); //list to all tab     
      this.selectedTab=item;
      
    } else {
      this.context.action("unselectTab."+item.id,item);
      this.context.action("unselectTab",item);
      this.selectedTab=null;
    }
    this.setState({ selectedTab: selected },function(){
        //HOW TO NOTIFY TAB ??

    }.bind(this));
  }
  ,renderTab:function(item,idx) {
    var onPress= item.onPress ||  this.selectTab.bind(this,item,idx) ;

    return  <TabNavigator.Item
    selected={this.state.selectedTab ===item.id}
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