var {
	Dimensions
} = require("react-native");
var {registerGetter}=require("../model");
var windowH=screenH=Dimensions.get("window").height;
var windowW=screenW=Dimensions.get("window").width;
var isLandscape=false;
if (windowW>windowH) {
	var t=windowW;
	windowW=windowH;
	windowH=t;
	isLandscape=true;
}

var getDimension=function(){
	return {landscape:isLandscape,width:windowW,height:windowH, 
		screenWidth:screenW,screenHeight:screenH};
}
registerGetter("dimension",getDimension,{overwrite:true});
var orientationMixin = {
	orientationChanged:function(_isLandscape){
		screenH=windowH;
		screenW=windowW;
		if (_isLandscape){
	    	screenH=windowW;
	    	screenW=windowH;
		}
		isLandscape=_isLandscape;
	}

	,onLayout:function(event){
		var layout=event.nativeEvent.layout;
		var _isLandscape = layout.height <= windowW;
		if (this.state.isLandscape!==_isLandscape) {
			this.orientationChanged(_isLandscape);
			this.setState({isLandscape:_isLandscape});
			registerGetter("dimension",getDimension,{overwrite:true});
		}
		isLandscape=_isLandscape;
	}
};

module.exports=orientationMixin;