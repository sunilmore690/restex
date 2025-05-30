import fs from 'fs';
import path from 'path';

/**
 * Initialize Sequelize models from the models directory
 * @param {Object} sequelize - Sequelize connection instance
 * @param {Object} Sequelize - Sequelize module
 * @param {String} modelsPath - Path to models directory
 * @returns {Object} - Object containing all initialized models
 */
export default function(sequelize, Sequelize, modelsPath) {
  const obj = {};
  
  if (!fs.existsSync(modelsPath)) {
    throw new Error(`Given Models Path ${modelsPath} does not exist`);
  }
  
  fs.readdirSync(modelsPath).forEach(file => {
    // We need to use require here since we're loading user-defined models
    // In a full ES module environment, users would need to use .mjs extension
    // or package.json with "type": "module"
    const model = require(path.join(modelsPath, file))(sequelize, Sequelize);
    obj[model.name] = model;
  });
  
  return obj;
}