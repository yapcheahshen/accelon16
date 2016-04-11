var kfs = require('react-native').NativeModules.KsanaFileSystem;


var downloadfile=function(fn,cb){
		kfs.kdbExists(fn,function(exists){
		if (!exists) {
			console.log("download "+fn);

			kfs.download("http://ya.ksana.tw/accelon2016/"+fn+".kdb","",function(err,data){
				if (!err) {
					cb();
				} else {
					throw "cannot download "+fn;
				}
			});
		} else {
			cb();
		}
	});
}
module.exports=function(cb){
	downloadfile("dsl_jwn",function(){ downloadfile("ds",cb)});
}
