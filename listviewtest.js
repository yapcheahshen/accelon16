var React=require("react-native");
var {
  View,Text,Image,ListView,StyleSheet,TouchableHighlight,TextInput
} =React;
var rows=[],loaded={};
var rowY={};
for (var i=1;i<=1000;i+=1) rows.push({text:''});
/*
 list view experiment
 cloneWithRows , the array passed must be changed too (assume immutable array) 

 optimal row count <2000

 text will be fetched if needed when a row become visible 
*/
var ListViewTest=React.createClass({

	getInitialState:function(){
		var ds=new ListView.DataSource({rowHasChanged:this.rowHasChanged});
		return {uti:'100',dataSource: ds.cloneWithRows(this.getRows({}))};
	}
	,rowHasChanged:function(r1,r2){
		return (r1!==r2) || (r1.text!==r2.text);
	}
	,getRows:function(loaded){
		var out=[];
		for (var i=0;i<rows.length;i++) {
			if (loaded[i]) {
				rows[i]=JSON.parse(JSON.stringify(rows[i]));
				rows[i].text=loaded[i];
			}
			out.push( rows[i] );
		}
		return out;
	}
	,randomText:function() {
		var s="";
		for (var i=0;i<200;i++) {
			s+=String.fromCharCode(0x4e00+ Math.floor(Math.random()*20000)) ;
		}
		return s;
	}
	,onChangeVisibleRows:function(visibleRows){
		var loading=false;
		for (row in visibleRows.s1) {
			if (!rows[row].text) {
				loaded[row]=row+":"+this.randomText();
				loading=true;
			}
		}

		if (!loading) return;
		var ds=this.state.dataSource.cloneWithRows(this.getRows(loaded));
		this.setState({dataSource:ds},function(){
			loaded={};
			if (this.uti) {
				setTimeout(function(){
					this.refs.list.scrollTo( rowY[this.state.uti],0);
					this.uti=null;
				}.bind(this),800); //wait until layout complete

			}
		}.bind(this));

	}
	,setUti:function(text) {
		this.setState({uti:text})
	}
	,onRowLayout:function(rowid,e){
		rowY[rowid]=e.nativeEvent.layout.y;
	}
	,renderRow:function(rowData,sectionId,rowId,highlightRow){	
		return <View style={{overflow:'hidden'}} onLayout={this.onRowLayout.bind(this,rowId)}><Text>{rowData.text?rowData.text:rowId}</Text></View>
	}
	,scroll:function(){
		var y=rowY[this.state.uti];
		this.uti=this.state.uti;//when text is loaded scroll again
		if (y) this.refs.list.scrollTo( y,0);
	}
	,render:function(){
		return <View style={{flex:1,top:22}}>
		<TextInput style={{width:100,height:22}} ref="uti" onChangeText={this.setUti} value={this.state.uti}/>
		<TouchableHighlight onPress={this.scroll}><Text>scroll</Text></TouchableHighlight>
		<ListView ref="list" style={{overflow:'hidden'}} dataSource={this.state.dataSource} 
		renderRow={this.renderRow} onChangeVisibleRows={this.onChangeVisibleRows}
		 pageSize={30} initialListSize={1}/>
		</View>
	}
});
module.exports=ListViewTest;