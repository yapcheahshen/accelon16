var bookmarks=[{db:"dsl_jwn",uti:"2@時須菩提-1",text:"2@時須菩提"}];

var getBookmarks=function(cb){
	var bm=bookmarks.slice(0,bookmarks.length);
	if (cb) cb(bm);
	return bm;
}
var addBookmark=function(opts){
	bookmarks=bookmarks.filter(function(bm){return !(bm.uti===opts.uti && bm.db===opts.db)});
	bookmarks.unshift({db:opts.db,uti:opts.uti,text:opts.text||opts.uti});
}
var deleteBookmark=function(n){
	n=parseInt(n);
	if (n>-1&&n<bookmarks.length) {
		bookmarks.splice(n,1);
	}
}
module.exports={getBookmarks,addBookmark,deleteBookmark};