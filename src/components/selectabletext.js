var React=require("react-native");
var {
  View,Text,Image,StyleSheet,ScrollView,
  StatusBarIOS,AppRegistry,Dimensions,LayoutAnimation,PixelRatio,Platform,PropTypes
} =React;
var Paragraph=require("./paragraph");
var SelectableText=React.createClass({
	propTypes:{
		onMode:PropTypes.func.isRequired
	}
	,getInitialState:function(){
		return {paraStart:-1,paraEnd:-1,token:null};
	}
	,onTouchStart:function(n,evt) {
		if (evt.nativeEvent.touches.length==1){
			if (this.state.paraStart===n && this.state.paraEnd===n) {
				this.cancelSelection();
			} else {
				this.setState({paraStart:n,paraEnd:n});
			}
		} else {
			this.setState({paraEnd:n});
		}
	}
	,isSelected:function(n){
		var start=this.state.paraStart;
		var end=this.state.paraEnd;
		if (end<start &&end>-1) {
			var t=end;
			end=start;
			start=t;
		}
		return (n>=start)&&(n<=end);
	}
	,cancelSelection:function(){
		this.setState({paraStart:-1,paraEnd:-1});
	}
	,trimSelection:function(para,start) {
		if (start) {
			this.setState({paraStart:para});
		} else {
			this.setState({paraEnd:para});
		}
	}
	,renderSentence:function(text,idx){
		if(this.isSelected(idx)) {
			return <Paragraph key={idx} para={idx} text={text} token={this.state.token} 
			selectToken={this.selectToken} 
			paraStart={this.state.paraStart} 
			paraEnd={this.state.paraEnd}
			trimSelection={this.trimSelection}
			cancelSelection={this.cancelSelection}/>
		} else {
			return <View key={idx}><Text  style={styles.paragraph}
			 onTouchStart={this.onTouchStart.bind(this,idx)}>{text}</Text></View>
		
		}
	}
	,render:function(){
		return <ScrollView  style={{flex:1,top:22}}>
      		{this.props.texts.map(this.renderSentence)}
    	</ScrollView>
	}
});

var styles=StyleSheet.create({
	paragraph:{fontSize:24},
	selectedParagraph:{backgroundColor:'lightyellow'}
})

module.exports=SelectableText;