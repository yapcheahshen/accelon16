var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableOpacity,ListView,PixelRatio
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var ksa=require("ksana-simple-api");

var ResultListView=React.createClass({
	contextTypes:{
		action:PT.func
	}
	,getInitialState:function(){
		this.items=this.props.items.slice();
		var ds=new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});
		return {dataSource:ds.cloneWithRows(this.props.items)};
	}
	,componentWillReceiveProps:function(nextProps){
		return {dataSource:this.state.dataSource.cloneWithRows(nextProps.items)};
	}
	,renderKWIC:function(rowdata){
		return ksa.renderHits(rowdata.text,rowdata.hits,function(opts,t){
						if (t.length>10) {
							t=opts.key===0?"":t.substr(0,5)+"..."+t.substr(t.length-5);
						}
						return E(Text,{key:opts.key,style:styles[opts.className]},t.trim());
					})
	}
	,goText:function(i){
		var item=this.props.items[i];
		this.context.action("gotoTemp",{uti:item.uti,db:this.props.db});
	}
	,renderRow:function(rowdata,rid,idx) {
		return E(TouchableOpacity ,{onPress:this.goText.bind(this,idx)},

				E(View,null,
				E(View,{style:styles.rowsep}),
				E(Text,{style:{fontSize:this.props.fontSize,overflow:'hidden'}},
					E(Text,{style:styles.rownumber},(1+parseInt(idx))),this.renderKWIC(rowdata)
				
			)));
	}
	,render:function(){
		return E(View,{style:{flex:1}},
		E(ListView,{ref:"list",style:[this.props.style,{overflow:'hidden'}],
		 dataSource:this.state.dataSource 
		 ,renderRow:this.renderRow
		 ,pageSize:20,initialListSize:10}));
	}

});

var styles={
	rownumber:{fontFamily:"Courier",backgroundColor:'silver'},
	hl0:{color:'red'},
	rowsep:{margin:3,height:1/PixelRatio.get(),backgroundColor:'silver'}
}

module.exports=ResultListView;