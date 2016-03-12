var React=require("react-native");
var {
  View,Text,TextInput,Image,StyleSheet,TouchableOpacity,ListView
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var SwipeOut=require("react-native-swipeout");

var SwipableListView=React.createClass({
	propTypes:{
		renderRow:PT.func.isRequired,
		rows:PT.array.isRequired
	}
	,componentDidMount:function(){
		this.rows=this.props.rows;
	}
	,componentWillReceiveProps:function(nextProps) {
		if (this.rows!==nextProps.rows) {
			this.rows=nextProps.rows;
			this._updateDataSource(nextProps.rows);
		}
	}
	,getInitialState:function(){
		var ds=new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});	
		return {dataSource:ds.cloneWithRows(this.props.rows)};
	}	
	, _handleSwipeout: function(sectionID, rowID) {
		var rows=this.rows.slice();
		for (var i = 0; i < rows.length; i++) {
			var active=rows[i].active;
			if (i != rowID && rows[i].active) rows[i].active = false ;
			else if (!rows[i].active) rows[i].active = true ;
			if (rows[i].active!==active) {
				rows[i]=JSON.parse(JSON.stringify(rows[i]));
			}
		}
		this.rows=rows;
		this._updateDataSource(rows);
	}
	, _updateDataSource: function(data) {
		this.setState({
		  dataSource: this.state.dataSource.cloneWithRows(data)
		})
	}	
	, _allowScroll: function(scrollEnabled) {
	    this.setState({ scrollEnabled: scrollEnabled })
	}
	,renderRow:function(rowData,sectionID,rowID) {
		return E(View,{},
				E(SwipeOut,{left:this.props.getButtons(rowID),sectionID,rowID,close:!rowData.active,
					onOpen:(sectionID, rowID) => this._handleSwipeout(sectionID, rowID),
					scroll: event => this._allowScroll(event)}
				 ,this.props.renderRow(rowData,sectionID,rowID)
				 ,this.props.separator
				));
	}	
	,render:function(){
		return	E(ListView,{dataSource:this.state.dataSource,
					scrollEnabled:this.state.scrollEnabled,
					renderRow:this.renderRow});
	}
});
module.exports=SwipableListView;