var React=require("react-native");
var {
  View,Text,Image,ListView,StyleSheet,TouchableHighlight, Dimensions
} =React;
var E=React.createElement;
var PT=React.PropTypes;

//TODO: handle orientation
var W=Dimensions.get("window").width;
var H=Dimensions.get("window").height;

var Button=require("../components/button");
var HeadPopupMenu=React.createClass({
	getInitialState: function() {
	  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	  var rows=[];
	  return {
	  	rows:rows,
	    dataSource: ds.cloneWithRows(rows),
	  };
	},
	contextTypes:{
		action:PT.func,
		getter:PT.func
	}
	,propTypes:{
		db:PT.string.isRequired
		,vpos:PT.number.isRequired
		,tocname:PT.string
	}
	,enumChild:function(toc,ancestors) {
		var now=ancestors[ancestors.length-1];
		var parent=ancestors[ancestors.length-2];

		//need enum Child in ksana-simple-api
		var o=[];
		var child=parent+1;
		if (child && toc[child].d==toc[parent].d+1) {
			while (child && toc[child]) {
				var item={text:toc[child].t};
				if (child===now) item.selected=true;
				o.push(item);

				if (toc[child+1].d===toc[child].d) {
					child++;
				} else {
					child=toc[child].n;
				}
				
			}
		} else {
			console.error("enumChild wrong",ancestors);	
		}
		return o;
	}
	,componentDidMount:function(){
		this.context.getter("toc",this.props,function(toc){
			var rows=this.enumChild(toc.toc,toc.nodeseq);
			var dataSource=this.state.dataSource.cloneWithRows( rows );
			this.setState({dataSource,rows});
		}.bind(this));
	}
	,onSelectItem:function(row){
		console.log(row)
		//this.context.action("pushText",{db:this.props.db,replaceCamp:true});
	}
	,renderRow:function(rowData,col,idx){
		return E(Text,{onPress:rowData.selected?null:this.onSelectItem.bind(this,idx) ,
			style:[styles.item, rowData.selected?styles.selectedItem:styles.selectableItem] },rowData.text);
	}
	,render:function(){
  		return E(ListView,{style:styles.popup,dataSource:this.state.dataSource, renderRow:this.renderRow});
	}
});
var styles=StyleSheet.create({
	popup:{flexDirection:'column',padding:5,height:W/2.5}
	,item:{fontSize:24}
	,selectedItem:{backgroundColor:'rgb(192,216,255)'}
	,selectableItem:{color:'rgb(96,136,255)'}
});
module.exports=HeadPopupMenu;