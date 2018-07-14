const fs = require("fs");
const path = require("path");
var mongoosePaginate = require("mongoose-paginate");
module.exports = function(mongoose, modelsPath) {
  let obj = {};

  fs.readdirSync(modelsPath).forEach(file => {
    let file_name = path.parse(file).name;
    let modelSchema = require(modelsPath + "/" + file)(require('mongoose'));
    let model_name = modelSchema.statics ? modelSchema.statics.collectionName: file_name;
    modelSchema.plugin(mongoosePaginate);
    obj[model_name] = mongoose.model(model_name || file_name , modelSchema);
  });
  //   console.log('obj',obj)
  return obj;
};
