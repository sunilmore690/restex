const fs = require("fs");
const path = require("path");

module.exports = function(sequelizer,modelsPath) {
  let obj = {}
  fs.readdirSync(modelsPath).forEach(file => {
    let model_name = path.parse(file).name
    obj[model_name] = sequelizer.define(model_name,require(modelsPath  + '/' +file));
  });
//   console.log('obj',obj)
  return obj;
};

