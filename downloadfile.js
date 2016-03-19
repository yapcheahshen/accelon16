var kfs = require('react-native').NativeModules.KsanaFileSystem;

module.exports=function(cb){
	kfs.kdbExists("dsl_jwn",function(exists){
		if (!exists) {
			console.log("download dsl_jwn");

			kfs.download("http://ya.ksana.tw/accelon2016/dsl_jwn.kdb","",function(err,data){
				if (!err) {
					cb();
				} else {
					throw "cannot download dsl_jwn";
				}
			});
		} else {
			cb();
		}
	}) 	
}
