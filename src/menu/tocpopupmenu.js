var React=require("react-native");
var {
  View,Text,Image,ListView,StyleSheet,TouchableOpacity, Dimensions,LayoutAnimation
} =React;
var E=React.createElement;
var PT=React.PropTypes;

//TODO: handle orientation
var W=Dimensions.get("window").width;
var H=Dimensions.get("window").height;

var Button=require("../components/button");
var jumpIcon=require("../../images/next.png");
var homeIcon=require("../../images/home.png");
var HeadPopupMenu=React.createClass({
	getInitialState: function() {
	  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	  var rows=[];
	  return {
	  	ancestors:[],
	  	rows:rows,
	    dataSource: ds.cloneWithRows(rows),
	  };
	}
	,contextTypes:{
		action:PT.func,
		getter:PT.func
	}
	,propTypes:{
		db:PT.string.isRequired
		,vpos:PT.number.isRequired
		,tocname:PT.string
		,popupX:PT.number //desire popup x
	}
	,enumChild:function(toc,ancestors_nodes) {
		var now=ancestors_nodes[ancestors_nodes.length-1];
		var parent=ancestors_nodes[ancestors_nodes.length-2];

		//need enum Child in ksana-simple-api
		var o=[];
		var child=parent+1;
		if (child && toc[child].d==toc[parent].d+1) {
			while (child && toc[child]) {
				var item={text:toc[child].t,n:child};
				//if (child===now) item.selected=true;
				
				if (toc[child+1].d===toc[child].d+1) item.hasChild=true;
				o.push(item);

				if (toc[child+1].d===toc[child].d) {
					child++;
				} else {
					child=toc[child].n;
				}
				
			}
		} else {
			console.error("enumChild wrong",ancestors_nodes);	
		}
		return o;
	}
	,componentWillReceiveProps:function(){
		this.getToc();
	}
	,componentDidMount:function(){
		this.getToc();
	}
	,getToc:function(vpos){
		var props=this.props;
		if (vpos) {
			props=JSON.parse(JSON.stringify(this.props)); 
			props.vpos=vpos;
		}
		this.context.getter("toc",props,function(toc){
			var rows=this.enumChild(toc.toc,toc.nodeseq);
			var ancestors=toc.nodeseq.slice(0,toc.nodeseq.length-1);
			var dataSource=this.state.dataSource.cloneWithRows( rows );
			if (vpos) LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
			this.setState({dataSource,rows,ancestors,toc:toc.toc});
		}.bind(this));
	}
	,onSelectChild:function(row){
		var n=this.state.rows[row].n;
		this.getToc(this.state.toc[n+1].vpos+1);
	}
	,onSelectAncestor:function(ancestor) {
		this.getToc(this.state.toc[ancestor+1].vpos+1);	
	}
	,jump:function(){
		//this.context.action("pushText",{db:this.props.db,replaceCamp:true});
	}
	,renderAncestor:function(ancestor,idx){
		var A=this.state.toc[ancestor];
		var last=idx==this.state.ancestors.length-1;
		var prefix=null,suffix=null;
		var t=A.t;
		if (!last) suffix=">";
		if (idx===0) {
			prefix=" ";suffix=" ";
			t=E(Image,{source:homeIcon,height:20,width:20});
		}
		
		return E(Text,{key:idx,style:[styles.ancestor, !last?styles.selectableItem:null]
				,onPress:last?null:this.onSelectAncestor.bind(this,ancestor)},prefix,t,suffix);
	}
	,renderRow:function(rowData,col,idx){
		return E(View,{style:styles.child},
				E(Text,{onPress:rowData.hasChild?this.onSelectChild.bind(this,idx):null ,
					style:[styles.item,rowData.hasChild?styles.selectableItem:null] },
					rowData.text)
				,rowData.selected?null:E(Text,{onPress:this.jump},"     ",E(Image,{source:jumpIcon,height:18,width:24}),"     \n")	
			);
	}
	,render:function(){
  		return E(View,{style:styles.popup},
  			E(Text,{style:styles.ancestors},this.state.ancestors.map(this.renderAncestor)),
  			E(ListView,{styles:styles.children,dataSource:this.state.dataSource, 
  				renderRow:this.renderRow})
  			);
	}
});
var styles=StyleSheet.create({
	popup:{width:W-40,overflow:'hidden'} //deduct size of landscape tabbar at the right
	,children:{margin:5,flexDirection:'column'}
	,ancestors:{backgroundColor:'rgb(200,200,200)'}
	,ancestor:{fontFamily:"DFKai-SB",fontSize:22,lineHeight:28}
	,item:{fontFamily:"DFKai-SB",fontSize:24}
	,selectedItem:{backgroundColor:'rgb(192,216,255)'}
	,selectableItem:{color:'rgb(0,122,255)'}
	,child:{flexDirection:'row'}
});
module.exports=HeadPopupMenu;