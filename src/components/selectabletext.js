var React=require("react-native");
var {
  View,Text,Image,StyleSheet,
  StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;
var tokenize=function(text){
	var out=[],lastidx=0;
	text.replace(/\w+/g,function(w,idx){
		var s=text.substring(lastidx,idx);
		if (s) out.push(s);
		lastidx=idx;
	});
	out.push(text.substring(lastidx));
	return out;
}
var SelectableText=React.createClass({
	propTypes:{
		onMode:PropTypes.func.isRequired
	}
	,getInitialState:function(){
		return {selected:null,token:null};
	}
	,selectSentence:function(idx){
		if (this.state.selected!==idx && this.state.token===null) {
			this.setState({selected:idx});
			this.props.onMode("sentence",{text:this.props.texts[idx],sentence:idx});
		} else {
			this.setState({selected:null,token:null});
			this.props.onMode();
		}
	}
	,selectToken:function(idx) {
		if (this.state.token===idx) {
			this.setState({token:null});
			this.props.onMode("sentence",{text:this.props.texts[this.state.selected]});
		} else {
			this.setState({token:idx});
			this.props.onMode("token",{token:idx});			
		}
	}
	,renderSelectable:function(text,idx) {
		var tokens=tokenize(text);
		var out=tokens.map(function(token,i){
			return <Text style={i===this.state.token?styles.selectedToken:null}
			 onPress={this.selectToken.bind(this,i)} key={i}>{token}</Text>
			
		}.bind(this));
		return out;
	}
	,renderSentence:function(text,idx){
		if(this.state.selected===idx) {
			return <Text key={idx} style={styles.selectedSentence}>
				{this.renderSelectable(text,idx)}</Text>
		} else {
			return <Text key={idx} 
			 onPress={this.selectSentence.bind(this,idx)}>{text}</Text>
		}
	}
	,render:function(){
		return <View style={{flex:1,top:22}}>
      		<Text style={styles.sentence}>{this.props.texts.map(this.renderSentence)}</Text>
    	</View>
	}
});

var styles=StyleSheet.create({
	sentence:{fontSize:36},
	selectedSentence:{backgroundColor:'lightyellow'},
	selectedToken:{backgroundColor:'yellow'}
})

module.exports=SelectableText;