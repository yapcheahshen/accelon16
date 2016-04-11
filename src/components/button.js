var React = require('react-native');
var {
  Text,
  TouchableOpacity ,
  View, 
} = React;
var E=React.createElement;
var Button = React.createClass({
  _handlePress: function() {
    this.props.onPress&&this.props.onPress(this.props.param);
  },
  render: function() {
    return E(TouchableOpacity,{underlayColor:"rgba(0,0,0,0.3)",onPress:this._handlePress},
        E(View,{style:[styles.button,this.props.style]},
          E(Text,{style:[styles.buttonText,this.props.buttonStyle]},this.props.text))
    );
  }
});

var styles={
button: {
    height:34, paddingLeft:15 ,paddingRight:15, paddingTop:5}
  ,buttonText: {
    color: 'rgb(0,137,255)',
  }
}
module.exports=Button;