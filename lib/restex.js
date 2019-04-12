const validate = function(options) {
  // console.log(options);
  if (!options.database.provider) {
    throw new Error("Please provide datbase provider sequelize or mongo");
  } else if (["mongo", "sequelize"].indexOf(options.database.provider) < 0) {
    throw new Error("datbase provider should be mongo sequelize");
  } else if (typeof options.database.conn != "object") {
    throw new Error("Please provide connection details for mongodb database ");
  }
};
const MongoDao = require("./mongodb/index");
const SeqalizeDao = require("./sequelize/index");
const path = require('path');
module.exports = function(app, options) {
  this.options = options || {};
  this.options.modelsPath = this.options.modelsPath || path.resolve("./models");
  this.options.controllersPath =
    this.options.controllersPath || path.resolve("./controllers");
  this.options.routesPath = this.options.routesPath || path.resolve("./routes");
  this.options.middlewaresPath = this.options.middlewaresPath || path.resolve("./middleware.js");
  this.options.database = this.options.database || {};
  validate(this.options);
  if (this.options.database.provider == "mongo") {
    return new MongoDao(app, options);
  } else {
    throw Error('Currently we support only mongo provider')
    //return new SeqalizeDao(app, options);
  }
};
