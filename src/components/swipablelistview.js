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
		rows:PT.array.isRequired,
		getButtons:PT.func.isRequired,
		onEditRow:PT.func,
		onEditDone:PT.func
	}
	,componentDidMount:function(){
		this.rows=this.props.rows;
	}
	,componentWillReceiveProps:function(nextProps) {
		if (this.rows!==nextProps.rows) {
			this.rows=nextProps.rows;
			this._updateDataSource(nextProps.rows);
		}
		console.log(this.rows)
	}
	,getInitialState:function(){
		var ds=new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});	
		return {dataSource:ds.cloneWithRows(this.props.rows)};
	}	
	, _handleSwipeout: function(sectionID, rowID) {
		var rows=this.rows.slice(),editing=-1;
		rowID=parseInt(rowID);
		for (var i = 0; i < rows.length; i++) {
			var active=rows[i].active;
			if (i != rowID) {
				rows[i].active = false ;
			} else {
				rows[i].active = true ;
				editing=i;
			}
			rows[i]=JSON.parse(JSON.stringify(rows[i]));
		}
		this.rows=rows;
		this._updateDataSource(rows);
		this.props.onEditRow&&this.props.onEditRow(editing);
	}
	,_handleClose :function(sectionID, rowID) {
		//need to add this.props.onClose(this.props.sectionID,this.props.rowID);
		//in react-native-swipeout
		var rows=this.rows.slice();
		rowID=parseInt(rowID);
		rows[rowID]=JSON.parse(JSON.stringify(rows[rowID]));
		rows[rowID].active=false;
		this.rows=rows;
		this._updateDataSource(rows);
		this.props.onEditDone&&this.props.onEditDone(rowID);
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
				E(SwipeOut,{left:this.props.getButtons(rowData,sectionID,rowID),
						sectionID,rowID,close:!rowData.active,
					onOpen:(sectionID, rowID) => this._handleSwipeout(sectionID, rowID),
					onClose:(sectionID, rowID) => this._handleClose(sectionID,rowID),
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