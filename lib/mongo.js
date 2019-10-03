const MongoDao = require("./mongodb/index"),
path = require("path");

module.exports = new MongoDao({
  db: {
    connectionString: config.mongodb.URI,
    debug: process.env.NODE_ENV == 'development' ? true:false;
  },
  modelPath: path.resolve("./models/mongo/")
});
