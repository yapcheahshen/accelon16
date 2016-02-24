var React=require("react-native");
var {
  View,Text,Image,StyleSheet,Navigator,TouchableHighlight,TouchableOpacity
} =React;
var {NavigationBar} = Navigator;
var E=React.createElement;


function newRandomRoute() {
  return {
    title: '#' + Math.ceil(Math.random() * 1000),
  };
}
var NavigationBarRouteMapper ={
	 LeftButton: function(route, navigator, index, navState) {
	    if (index === 0) {
	      return null;
	    }

	    var previousRoute = navState.routeStack[index - 1];
	    return (
	      <TouchableOpacity
	        onPress={() => navigator.pop()}
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
	          Next
	        </Text>
	      </TouchableOpacity>
	    );
	  }
	,Title:function(route,navigator,index,navstate) {
    return (
      E(Text,{style:[styles.navBarText, styles.navBarTitleText]},route.title+index)
      
    );
 	}
};

var renderScene=function(route,navigator){
	return <View style={{flex:1,paddingTop:20}}  name={route.name}><Text>{route.name}</Text></View>
}
var navigator_test=React.createClass({
	render:function(){
		return <Navigator navigationBar={<NavigationBar routeMapper={NavigationBarRouteMapper}/>}
    	initialRoute={{title: 'My First Scene', index: 0}}
 	   renderScene={renderScene} />
	}
});
var styles = StyleSheet.create({
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
});
module.exports=navigator_test;