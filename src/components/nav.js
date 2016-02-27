
var React=require("react-native");
var {
  View,Text,Image,StyleSheet,Navigator,TouchableHighlight,TouchableOpacity
} =React;
var {NavigationBar} = Navigator;
var E=React.createElement;
var PT=React.PropTypes;

function newRandomRoute() {
  return {
    title: '#' + Math.ceil(Math.random() * 1000),
  };
}
var Nav=React.createClass({
   shouldComponentUpdate:function(nextProps){
    return (nextProps.model!==this.props.model)
   }
   ,NavigationBarRouteMapper:{
     LeftButton: function(route, navigator, index, navState) {
        if (index === 0) return null;
        var previousRoute = navState.routeStack[index - 1];
        return (
          <TouchableOpacity onPress={() => navigator.pop()}
            style={styles.navBarLeftButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              {previousRoute.title}
            </Text>
          </TouchableOpacity>
        );
      },

      RightButton: function(route, navigator, index, navState) {
        return (
          <TouchableOpacity
            onPress={() => navigator.push(newRandomRoute())}
            style={styles.navBarRightButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              Next2
            </Text>
          </TouchableOpacity>
        );
      }
    ,Title:function(route,navigator,index,navstate) {
      return (
        E(Text,{style:[styles.navBarText, styles.navBarTitleText]},route.title+"="+index)
        
      );
    }
  }
  ,componentWillMount:function(){
    this.props.model.init();
  }
  ,renderScene:function(route,navigator) {
    console.log("render Scene")
    return E(this.props.model.scene, {route:route,navigator:navigator});
  }
  ,propTypes:{
    model:PT.object.isRequired
  }
	,render:function(){
		return <Navigator 
      navigationBar={E(NavigationBar,{style:styles.navBar,routeMapper:this.NavigationBarRouteMapper})}
    	initialRoute={this.props.model.initialRoute}
 	    renderScene={this.renderScene} />
	}
});

var styles = StyleSheet.create({

  navBar: {
    backgroundColor: 'rgb(212,212,212)',
    height:45,
  },
  navBarText: {
    fontSize: 16,
    color:'rgb(0,122,255)',
    marginVertical: 0,
  },
  navBarTitleText: {
    fontWeight: '500',
    marginVertical: 0,
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