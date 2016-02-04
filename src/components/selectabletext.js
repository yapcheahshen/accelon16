var React=require("react-native");
var {
  View,Text,Image,StyleSheet,ScrollView,
  StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;
var Sentence=require("./sentence");
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
	,renderSentence:function(text,idx){
		if(this.state.selected===idx) {
			return <Sentence key={idx} text={text} token={this.state.token} selectToken={this.selectToken}/>
				
		} else {
			return <View key={idx}><Text  style={styles.sentence}
			 onPress={this.selectSentence.bind(this,idx)}>{text}</Text></View>
		
		}
	}
	,render:function(){
		return <ScrollView style={{flex:1,top:22}}>
      		{this.props.texts.map(this.renderSentence)}
    	</ScrollView>
	}
});

var styles=StyleSheet.create({
	sentence:{fontSize:24},
	selectedSentence:{backgroundColor:'lightyellow'}
})

module.exports=SelectableText;