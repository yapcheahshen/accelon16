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
		return {senStart:0,senEnd:-1,token:null};
	}
	,onTouchStart:function(n,evt) {
		if (evt.nativeEvent.touches.length==1){
			if (this.state.senStart===n && this.state.senEnd===n) {
				this.cancelSelection();
			} else {
				this.setState({senStart:n,senEnd:n});
			}
		} else {
			this.setState({senEnd:n});
		}
	}
	,isSelected:function(n){
		var start=this.state.senStart;
		var end=this.state.senEnd;
		if (end<start &&end>-1) {
			var t=end;
			end=start;
			start=t;
		}
		return (n>=start)&&(n<=end);
	}
	,cancelSelection:function(){
		this.setState({senStart:0,senEnd:-1});
	}
	,trimSelection:function(sen,start) {
		if (start) {
			this.setState({senStart:sen});
		} else {
			this.setState({senEnd:sen});
		}
	}
	,renderSentence:function(text,idx){
		if(this.isSelected(idx)) {
			return <Sentence key={idx} sen={idx} text={text} token={this.state.token} 
			selectToken={this.selectToken} 
			senStart={this.state.senStart} 
			senEnd={this.state.senEnd}
			trimSelection={this.trimSelection}
			cancelSelection={this.cancelSelection}/>
		} else {
			return <View key={idx}><Text  style={styles.sentence}
			 onTouchStart={this.onTouchStart.bind(this,idx)}>{text}</Text></View>
		
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