const SeqalizeDao = require("./sequelize/index"),
  config = require("config");
path = require("path");

module.exports = new SeqalizeDao({
  db: config.sequelize,
  modelsPath: path.resolve("./models/sequelize/")
});
