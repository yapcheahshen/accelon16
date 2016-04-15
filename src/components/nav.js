
var React=require("react-native");
var {
  View,Text,Image,StyleSheet,Navigator,TouchableHighlight,TouchableOpacity
} =React;
var {NavigationBar} = Navigator;
var E=React.createElement;
var PT=React.PropTypes;

var NavigationBarRouteMapper={
      LeftButton: function(route, navigator, index, navState) {
        var leftButtonOnPress=navigator.props.model.leftButtonOnPress;
        
        var leftButtonText=navigator.props.model.leftButtonText(route);
        return (
          <TouchableOpacity onPress={()=>leftButtonOnPress(route,navigator)}
            style={styles.navBarLeftButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              {leftButtonText}
            </Text>
          </TouchableOpacity>
        );
      },

      RightButton: function(route, navigator, index, navState) {
        var rightButtonText=navigator.props.model.rightButtonText(route);
        var rightButtonOnPress=navigator.props.model.rightButtonOnPress;
        return (
          <TouchableOpacity
            onPress={()=>rightButtonOnPress(route,navigator)}
            style={styles.navBarRightButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
             {rightButtonText}
            </Text>
          </TouchableOpacity>
        );
    }
    ,Title:function(route,navigator,index,navstate) {
      var title=navigator.props.model.getTitle(route);
      return E(Text,{style:styles.navBarTitleText},title);
    }
}
var Nav=React.createClass({
  propTypes:{
    model:PT.object.isRequired
  }
  ,contextTypes:{
    store:PT.object.isRequired
  }
  ,getInitialState:function() {
    return {ready:false};
  }
  ,shouldComponentUpdate:function(nextProps,nextState){
    return (nextProps.model!==this.props.model || nextState.ready!==this.state.ready)
  }
  ,componentWillMount:function(){ 
    this.props.model.init(function(){
      this.setState({ready:true});
      this.props.model.navigator=this.refs.nav;
    }.bind(this));

  }
  ,componentDidMount:function(){
    this.context.store.listen("refreshNav",this.refreshNav,this);
  }
  ,refreshNav:function(){
    if (this.unmounted)return;
    this.forceUpdate();
  } 
  ,componentWillUnmount:function(){
    this.unmounted=true;
    this.context.store.unlistenAll(this);
    this.props.model.finalize();
  }
  ,renderScene:function(route,navigator) {
    return E(route.scene, {route:route,navigator:navigator,model:this.props.model});
  }
	,render:function(){
    if (!this.state.ready) return E(View);
		return <Navigator ref="nav" model={this.props.model}
      navigationBar={E(NavigationBar,{style:styles.navBar,routeMapper:NavigationBarRouteMapper})}
    	initialRouteStack={this.props.model.initialRouteStack}
      initialRoute={this.props.model.initialRoute}
 	    renderScene={this.renderScene} />
	}
});

var styles = StyleSheet.create({

  navBar: {
    backgroundColor: '#f8f8f8', //default value of react-native-tab-navigator
    height:45,
  },
  navBarText: {
    fontSize: 16,
    color:'rgb(0,122,255)',
    marginVertical: 3,
  },
  navBarTitleText: {
    fontWeight: '500',
    marginVertical: 3,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
  }
});
module.exports=Nav;