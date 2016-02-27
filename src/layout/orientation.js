var {
	Dimensions
} = require("react-native");

var windowH=screenH=Dimensions.get("window").height;
var windowW=screenW=Dimensions.get("window").width;
if (windowW>windowH) {
	var t=windowW;
	windowW=windowH;
	windowH=t;
}

var orientationMixin = {
	orientationChanged:function(isLandscape){
		screenH=windowH;
		screenW=windowW;
		if (isLandscape){
	    	screenH=windowW;
	    	screenW=windowH;
		}
	}
	,onLayout:function(event){
		var layout=event.nativeEvent.layout;
		var isLandscape = layout.height <= windowW;
		if (this.state.isLandscape!==isLandscape) {
			this.orientationChanged(isLandscape);
			this.setState({isLandscape:isLandscape});
		}
	}
};

module.exports=orientationMixin;