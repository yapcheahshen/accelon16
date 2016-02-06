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

var normalToken=function(token) {
	if (!token)return;
	var t=token.trim();
	var m=t.match(/[a-zA-Z\u3400-\u9fff\ud800-\udfff]*/);
	return (m && m[0]===t);
}

var Paragraph=React.createClass({
	propTypes:{
		paraStart:PropTypes.number.isRequired,//starting paragraph id
		paraEnd:PropTypes.number.isRequired, //ending paragraph id
		para:PropTypes.number.isRequired,  //paragraph id
		trimSelection:PropTypes.func.isRequired,
		cancelSelection:PropTypes.func.isRequired
	}
	,getInitialState:function() {
		return {tokens:tokenize(this.props.text),selStart:-1,selEnd:-1};
	}
	,start:0
	,touchToken:true //first touch
	,selectToken:function(idx){
		this.props.selectToken(idx);
	}
	,selectSentence:function(n){
		var start=n,end=n;
		while (start>-2) {
			if (normalToken(this.state.tokens[start-1])) start--;
			else break;
		}

		while (end<this.state.tokens.length) {
			if (normalToken(this.state.tokens[end+1])) end++;
			else break;
		}

		this.setState({selStart:start,selEnd:end});
	}
	,onTokenTouchStart:function(n,evt){
		if (evt.nativeEvent.touches.length==1){
			if (n===this.state.selStart && n==this.state.selEnd) {
				this.selectSentence(n);
				return;
			}
			this.setState({selStart:n,selEnd:n});
			this.props.trimSelection(this.props.para,true);
		} else {
			this.setState({selEnd:n});
			if (this.state.selStart===-1) this.setState({selStart:n});
			this.props.trimSelection(this.props.para);
		}
		
	}
	,isSelected:function(n){
		var para=this.props.para;
		if (para>this.props.paraStart && para<this.props.paraEnd)return true;
		if (para<this.props.paraStart || para>this.props.paraEnd)return false;
		var start=this.state.selStart;
		var end=this.state.selEnd;
		if (end<start && end>-1) {
			var t=end;
			end=start;
			start=t;
		}

		if (para===this.props.paraEnd && para!==this.props.paraStart) {
			start=0;
		}
		if (para===this.props.paraStart && para!==this.props.paraEnd) {
			end=this.state.tokens.length;
		}

		return (n>=start)&&(n<=end);
	}
	,onTokenTouchEnd:function(){
		this.touchToken=true;
	}
	,onTouchEnd:function(evt){
		if (!this.touchToken) {
			this.props.cancelSelection();
		}
		this.touchToken=false;
	}
	,renderToken:function(token,idx){
		return <Text onTouchStart={this.onTokenTouchStart.bind(this,idx)}
		onTouchEnd={this.onTokenTouchEnd}
		style={this.isSelected(idx)?styles.selectedToken:null} 
		ref={idx} key={idx}>{token}</Text>
	}
	,render:function(){
		if (!this.props.text)return <View></View>;

		
//{...this._panResponder.panHandlers}
		return <View style={{flex:1}} onTouchEnd={this.onTouchEnd}>
		<Text style={styles.selectedParagraph}>
		{this.state.tokens.map(this.renderToken)}</Text></View>
	}
});
var styles=StyleSheet.create({
	selectedParagraph:{fontSize:24,backgroundColor:'lightyellow'},
	selectedToken:{backgroundColor:'yellow'}

	//textShadowColor:'yellow',	textShadowRadius:6,textShadowOffset:{width:1,height:1}}
})
module.exports=Paragraph;
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
