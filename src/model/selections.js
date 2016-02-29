/*
  Selections logic
  
  click on space or unclickable token to select a paragraph
  select another paragraph, paragraph without selection will be unselect

  use different color for odd and even selection, to differentiate adjacent selection.
  cross paragraph selection is break into multiple selection.

  selection:
     {
				rowid: []  //row is selectable, but no selection
				rowid: [  [start,len] , [start,len] ]
     }

  input:
  	web: 
 
  mode: single selection , multi selection

	store selection in context

*/

var Selections=function(opts) {
  opts=opts||{};
  var selections=opts.data||{};
  var getAll=function(){
    return selections;
  }
  var get=function(rowid) {
    return selections[rowid];
  }
  var clearAll=function(){
    selections={};
  }

  var clear=function(rowid) {
    delete selections[rowid];
  }

  var clearEmpty=function() {
    for (var i in selections) {
      if (selections[i].length===0) delete selections[i];
    }
  }
  var set=function(rowid,sel) {
    if (sel) {
      var newsel=JSON.parse(JSON.stringify(sel));
      if (newsel.length) {
        if (selections[rowid].length && selections[rowid][0][0]===newsel[0]) {
          selections[rowid]=[];
        } else {
          selections[rowid]=[newsel];
        }
      } else {
        selections[rowid]=newsel;
      } 
    } else {
      delete selections[rowid];
    }
    return true;
  }

  return {getAll:getAll,clear:clear,get:get,set:set,clearEmpty:clearEmpty};
}



module.exports=Selections;