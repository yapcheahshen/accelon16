var React=require("react-native");
var {
  View,Text,Image,StyleSheet,TouchableHighlight,PixelRatio
} =React;
var E=React.createElement;
var PT=React.PropTypes;
var SwipableListView=require("../components/swipablelistview");
var model=require("../model/member");
var deleteButton=require("../../images/delete.png");
var MarkupMember=React.createClass({
	deleteMember:function(rowId){
		model.remove(rowId);
	}
	,goMember:function(rowId){
		var sel=Object.assign(this.props.member[rowId],{replace:true});
		this.context.action("pushText",sel);
	}
	,getButtons:function(rowData,sectionId,rowId){
		return [{text:E(Image,{height:20,width:20,source:deleteButton}),
				 onPress:this.deleteMember.bind(this,rowId)
				}];	
	}
	,renderRow:function(rowData,sectionId,rowId) {
		var lefticon=rowId==0?"":"→"; //full width space "　"
		var righticon=rowId==0?"→":"";
		return 	E(View,{style:styles.row},
					E(Text,{}
						,E(Text,{style:styles.icon},lefticon)
						,E(Text,{onPress:this.goMember.bind(this,rowId)
							,style:styles.item},rowData.text||rowData.uti)
						,E(Text,{style:styles.icon},righticon)
				 	)
					,E(View,{style:styles.sep})
				);
	}
	,render:function(){
		return E(SwipableListView,{renderRow:this.renderRow,
			getButtons:this.getButtons,rows:this.props.member})
	}
});
var styles={
	row:{flex:1}
	,item:{fontSize:24,margin:5,color:'rgb(0,122,255)'}
	,icon:{fontSize:24}

	,sep:{height:1/PixelRatio.get(),backgroundColor:'rgb(192,192,192)'}
}
module.exports=MarkupMember;