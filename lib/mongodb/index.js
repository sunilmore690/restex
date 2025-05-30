import modelsInit from './models_init.js';
import routeInit from './route_init.js';

// Default callback function
const cbFunction = () => {};

// CRUD operations for MongoDB
const crud = {
  /**
   * Add a new document to the collection
   * @param {Object} data - Document data to add
   * @returns {Promise} - Promise resolving to the saved document
   */
  add(data, cb = cbFunction) {
    const model = new this.Model(data);
    return new Promise((resolve, reject) => {
      model.save((err, obj) => {
        if (err) reject(err);
        else resolve(obj);
      });
    });
  },

  /**
   * Get a single document from the collection
   * @param {Object} params - Query parameters
   * @param {Object} project - Projection options
   * @returns {Promise} - Promise resolving to the found document
   */
  get(params = {}, project, cb = cbFunction) {
    return this.Model.findOne(params, project).lean();
  },

  /**
   * Get all documents matching the query with pagination
   * @param {Object} params - Query parameters
   * @param {Object} options - Pagination options
   * @returns {Promise} - Promise resolving to paginated results
   */
  getAll(params = {}, options = {}, cb = cbFunction) {
    return this.Model.paginate(params, options);
  },

  /**
   * Delete documents matching the query
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise resolving to deletion result
   */
  destroy(params = {}, cb = cbFunction) {
    const query = this.Model.remove(params);
    return new Promise((resolve, reject) => {
      query.exec((err, data) => {
        if (err) reject(err);
        return resolve(data);
      });
    });
  },

  /**
   * Update documents matching the query
   * @param {Object} params - Query parameters
   * @param {Object} data - Update data
   * @param {Boolean} multi - Whether to update multiple documents
   * @returns {Promise} - Promise resolving to update result
   */
  update(params = {}, data, multi = false, cb = cbFunction) {
    const query = this.Model.update(params, { $set: data }, { multi });
    return new Promise((resolve, reject) => {
      query.exec((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
};

// Track loaded models
let models = [];

/**
 * MongoDB Data Access Object
 */
class Dao {
  /**
   * Create a new MongoDB DAO
   * @param {Object} app - Express application instance
   * @param {Object} options - Configuration options
   */
  constructor(app, { database: { mongoose, conn: { mongooseConnection, uri } }, controllersPath, modelsPath, routesPath, middlewaresPath }) {
    if (mongooseConnection) {
      this.mongoose = mongooseConnection;
    } else {
      mongoose.set('debug', true);
      this.mongoose = mongoose.createConnection(uri, { useNewUrlParser: true });
    }
    
    // Initialize models and routes
    models = modelsInit(this.mongoose, mongoose, modelsPath);
    this.map = routeInit.call(this, app, models, controllersPath, modelsPath, routesPath, middlewaresPath);
  }

  /**
   * Get a DAO for a specific model
   * @param {String} model_name - Name of the model
   * @returns {Object} - DAO with CRUD operations
   */
  dao(model_name) {
    const Model = models[model_name];
    if (!Model) {
      throw new Error(`Mongo Model ${model_name} does not exist`);
    }
    return Object.assign({ Model }, crud);
  }

  /**
   * Get a specific model
   * @param {String} model_name - Name of the model
   * @returns {Object} - Mongoose model
   */
  model(model_name) {
    const Model = models[model_name];
    if (!Model) {
      throw new Error(`Mongo Model ${model_name} does not exist`);
    }
    return Model;
  }
}

export default Dao;