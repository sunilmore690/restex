const fs = require("fs");
const path = require("path");
module.exports = function(sequelize,Sequelize,modelsPath) {
  let obj = {}
  fs.readdirSync(modelsPath).forEach(file => {
    const model = require(modelsPath  + '/' +file)(sequelize,Sequelize);
    
    obj[model.name] = model;
  });
//   console.log('obj',obj)
  return obj;
};

