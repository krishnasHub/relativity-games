// Loads the engine script out of index.html into a fresh context, so the tests run the same code the game does.
const fs=require('fs'),path=require('path'),vm=require('vm');
module.exports=function load(){
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const ctx=vm.createContext({});
  vm.runInContext(html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1],ctx);
  return ctx.PEngine;
};
