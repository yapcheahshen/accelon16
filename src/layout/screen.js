var {Dimensions,PixelRatio} =require("react-native");

var windowH=Dimensions.get("window").height;
var windowW=Dimensions.get("window").width;
var screenH=windowH,screenW=windowW;
if (screenW>screenH){
	screenW=windowH;
	screenH=windowW;
}

module.exports={width:screenW,height:screenH,pixelRatio:PixelRatio.get()};