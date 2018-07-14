const MongoDao = require("./mongodb/index"),
  config = require("config");
path = require("path");

module.exports = new MongoDao({
  db: {
    connectionString: config.mongodb.URI,
    debug: config.mongodb.debug
  },
  modelPath: path.resolve("./models/mongo/")
});
