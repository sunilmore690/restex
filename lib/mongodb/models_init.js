import fs from 'fs';
import path from 'path';
import mongoosePaginate from 'mongoose-paginate';

/**
 * Initialize MongoDB models from the models directory
 * @param {Object} mongoose - Mongoose connection instance
 * @param {Object} Mongoose - Mongoose module
 * @param {String} modelsPath - Path to models directory
 * @returns {Object} - Object containing all initialized models
 */
export default function(mongoose, Mongoose, modelsPath) {
  const obj = {};

  if (!fs.existsSync(modelsPath)) {
    throw new Error(`Given Models Path ${modelsPath} does not exist`);
  }

  fs.readdirSync(modelsPath).forEach(file => {
    const file_name = path.parse(file).name;
    // Use dynamic import for ES modules
    const modelPath = path.join(modelsPath, file);
    
    // We need to use require here since we're loading user-defined models
    // In a full ES module environment, users would need to use .mjs extension
    // or package.json with "type": "module"
    const modelSchema = require(modelPath)(Mongoose);
    
    const model_name = modelSchema.statics ? modelSchema.statics.collectionName : file_name;
    modelSchema.plugin(mongoosePaginate);
    obj[model_name] = mongoose.model(model_name || file_name, modelSchema);
  });

  return obj;
}