var React=require("react-native");
var {
  View,Text,Image,StyleSheet,
  StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;

var SelectableText=React.createClass({
	propTypes:{
		onMode:PropTypes.func.isRequired
	}
	,getInitialState:function(){
		return {selected:null}
	}
	,selectSentence:function(idx){
		if (this.state.selected!==idx) {
			this.setState({selected:idx});
			this.props.onMode("sentence",{text:this.props.texts[idx],idx:idx});
		} else {
			this.setState({selected:null});
			this.props.onMode();
		}
	}
	,renderSentence:function(text,idx){
		return <Text key={idx} style={[styles.sentence,this.state.selected==idx?styles.selectedSentence:null]}
		 onPress={this.selectSentence.bind(this,idx)}>{text}</Text>
	}
	,render:function(){
		return <View style={{flex:1,top:22}}>
      		<Text>{this.props.texts.map(this.renderSentence)}</Text>
    	</View>
	}
});

var styles=StyleSheet.create({
	sentence:{fontSize:36},
	selectedSentence:{backgroundColor:'lightyellow'}
})

module.exports=SelectableText;