import modelsInit from './models_init.js';
import routeInit from './route_init.js';

// CRUD operations for Sequelize
const crud = {
  /**
   * Add a new record to the database
   * @param {Object} data - Record data to add
   * @returns {Promise} - Promise resolving to the created record
   */
  add(data) {  
    return this.Model.create(data);
  },

  /**
   * Get a single record from the database
   * @param {Object} params - Query parameters
   * @param {Array} project - Attributes to include
   * @returns {Promise} - Promise resolving to the found record
   */
  get(params = {}, project) {
    return this.Model.findOne({ where: params });
  },

  /**
   * Get all records matching the query
   * @param {Object} params - Query parameters
   * @param {Array} attributes - Attributes to include
   * @returns {Promise} - Promise resolving to found records
   */
  getAll(params = {}, attributes) {
    return this.Model.findAll({ where: params, attributes });
  },

  /**
   * Delete records matching the query
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise resolving to deletion result
   */
  destroy(params = {}) {
    return this.Model.destroy({ where: params });
  },

  /**
   * Update records matching the query
   * @param {Object} params - Query parameters
   * @param {Object} data - Update data
   * @returns {Promise} - Promise resolving to update result
   */
  update(params, data) {
    return this.Model.update(data, { where: params });
  }
};

/**
 * Sequelize Data Access Object
 */
class Dao {
  /**
   * Create a new Sequelize DAO
   * @param {Object} app - Express application instance
   * @param {Object} options - Configuration options
   */
  constructor(app, {
    database,
    modelsPath,
    routesPath,
    controllersPath,
    middlewaresPath
  }) {
    this.modelPath = modelsPath;
    this.sequelize = database.conn;
    
    // Initialize models and routes
    const models = modelsInit(this.sequelize, database.Sequelize, modelsPath);
    this.models = models;
    
    this.map = routeInit.call(this, app, models, controllersPath, modelsPath, routesPath, middlewaresPath);
  }

  /**
   * Get a specific model
   * @param {String} model_name - Name of the model
   * @returns {Object} - Sequelize model
   */
  model(model_name) {
    const Model = this.models[model_name];
    return Model;
  }

  /**
   * Get a DAO for a specific model
   * @param {String} model_name - Name of the model
   * @returns {Object} - DAO with CRUD operations
   */
  dao(model_name) {
    const Model = this.models[model_name];
    if (!Model) {
      throw new Error(`Model ${model_name} does not exist`);
    }
    return Object.assign({ Model }, crud);
  }
}

export default Dao;