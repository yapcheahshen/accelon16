var {store,action,getter,registerGetter,unregisterGetter}=require("../model");
var AsyncStorage=require("react-native").AsyncStorage;

module.exports={getByFile,get,add};