import path from 'path';
import MongoDao from './mongodb/index.js';
import SeqalizeDao from './sequelize/index.js';

/**
 * Validates the options provided to the restex module
 * @param {Object} options - Configuration options
 * @throws {Error} If validation fails
 */
const validate = (options) => {
  if (!options.database.provider) {
    throw new Error('Please provide database provider sequelize or mongo');
  } else if (!['mongo', 'sequelize'].includes(options.database.provider)) {
    throw new Error('Database provider should be mongo or sequelize');
  } else if (typeof options.database.conn !== 'object') {
    throw new Error('Please provide connection details for database');
  }
};

/**
 * Main restex module that initializes the application with MongoDB or Sequelize
 * @param {Object} app - Express application instance
 * @param {Object} options - Configuration options
 * @returns {Object} - Instance of MongoDao or SeqalizeDao
 */
export default function(app, options = {}) {
  // Set default options using destructuring
  options = {
    modelsPath: path.resolve('./models'),
    controllersPath: path.resolve('./controllers'),
    routesPath: path.resolve('./routes'),
    middlewaresPath: path.resolve('./middleware.js'),
    database: {},
    ...options
  };

  // Validate options
  validate(options);

  // Return appropriate DAO based on provider
  if (options.database.provider === 'mongo') {
    return new MongoDao(app, options);
  } else if (options.database.provider === 'sequelize') {
    return new SeqalizeDao(app, options);
  } else {
    throw new Error(`Unsupported database provider: ${options.database.provider}`);
  }
}