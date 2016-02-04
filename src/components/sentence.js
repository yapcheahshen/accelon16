var React=require("react-native");
var {
  View,Text,StyleSheet,
  PanResponder,PropTypes
} =React;

var InspectorUtils = require('InspectorUtils');
var tokenize=function(text){
	return text.split("");
	var out=[],lastidx=0;
	text.replace(/\w+/g,function(w,idx){
		var s=text.substring(lastidx,idx);
		if (s) out.push(s);
		lastidx=idx;
	});
	out.push(text.substring(lastidx));
	return out;
}

var Sentence=React.createClass({
	getInitialState:function() {
		return {tokens:tokenize(this.props.text),selStart:0,selEnd:0};
	}
	,start:0
	,onMoving:function(){
		//console.log("pan moving");
	}
	,selectToken:function(idx){
		this.props.selectToken(idx);
	}
	,onTouchStart:function(n,evt){
		if (evt.nativeEvent.touches.length==1){
			this.selstart=n;
			this.setState({selStart:n,selEnd:n+1});
		} else {
			this.setState({selEnd:n});
		}
	//	console.log("touch start",arguments)
	}
	,onTouchEnd:function(e,evt){
	//	console.log("touch end",e)
	}
	,isSelected:function(n){
		var start=this.state.selStart;
		var end=this.state.selEnd;
		if (end<start) {
			var t=end;
			end=start;
			start=t;
		}
		return (n>=start)&&(n<end);
	}
	,renderToken:function(token,idx){
		return <Text onTouchEnd={this.onTouchEnd} 
		onTouchStart={this.onTouchStart.bind(this,idx)}
		style={this.isSelected(idx)?styles.selectedToken:null} 
		ref={idx} key={idx}>{token}</Text>
	}
	,render:function(){
		if (!this.props.text)return <View></View>;

		
//{...this._panResponder.panHandlers}
		return <View style={{flex:1}} >
		<Text style={styles.selectedSentence}>
		{this.state.tokens.map(this.renderToken)}</Text></View>
	}
});
var styles=StyleSheet.create({
	selectedSentence:{fontSize:24,backgroundColor:'lightyellow'},
	selectedToken:{backgroundColor:'yellow'}

	//textShadowColor:'yellow',	textShadowRadius:6,textShadowOffset:{width:1,height:1}}
})
module.exports=Sentence;
/*
componentWillMount:function(){
	 var me = this;
        me._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt,gestureState)=>true,
            onPanResponderStart: (evt, gestureState) => {
	 		
	 			//if (evt.nativeEvent.touches.length==2) {
	 				console.log(evt.nativeEvent.target);
	 				//var r=InspectorUtils.findInstanceByNativeTag(
	 				//	me._reactInternalInstance._rootNodeID,evt.nativeEvent.target)
	 				//console.log(r)
       			// }
	 			return true;
            },
            onPanResponderMove: me.onMoving,
            onResponderTerminationRequest: (evt, gestureState) => {
            	console.log("terminate request")
            	return false;//=> false
            },
            onPanResponderRelease: (evt, gestureState) => {
    			console.log("pan release",evt.nativeEvent.touches.length);
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
                console.log("pan terminate");
            }
        });
	}
	*/
