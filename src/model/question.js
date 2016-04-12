var Questions=[];

var AsyncStorage=require("react-native").AsyncStorage;


var loadQuestion=function(){
	AsyncStorage.getItem("questions",function(err,data){
		console.log(data)
		if (err) return;
		try {
			Questions=JSON.parse(data||"[]");
		} catch (e) {
			Questions=[];
		}
	});
}
loadQuestion();

var saveQuestion=function(){
	Questions.forEach(function(bk){delete bk.active});
	AsyncStorage.setItem("questions",JSON.stringify(Questions));
}

//{db:"dsl_jwn",uti:"2@時須菩提-1",text:"2@時須菩提"}

var getQuestions=function(cb){
	var bm=Questions.slice(0,Questions.length);
	if (cb) cb(bm);
	return bm;
}
var addQuestion=function(opts){
	Questions=Questions.filter(function(bm){return !(bm.uti===opts.uti && bm.db===opts.db)});
	Questions.unshift({db:opts.db,uti:opts.uti,text:opts.text||opts.uti});
	saveQuestion();
}
var setQuestion=function(n,opts) {
	Questions[n]=opts;
	saveQuestion();
}
var deleteQuestion=function(n){
	n=parseInt(n);
	if (n>-1&&n<Questions.length) {
		Questions.splice(n,1);
	}
	saveQuestion();
}
module.exports={getQuestions,addQuestion,setQuestion,deleteQuestion};