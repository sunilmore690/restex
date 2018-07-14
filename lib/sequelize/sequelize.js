var Sequelize = require("sequelize"),
  config = require("config").cloud;

module.exports = function({
  dialect,
  datbase_name,
  user,
  password,
  host,
  port
}) {
  var sequelize = new Sequelize(datbase_name, user, password, {
    host,
    port,
    dialect,
    define: {
      freezeTableName: true,
      timestamps: false
    },
    // sync: { force: true },
    pool: {
      max: 10,
      min: 1,
      idle: 10000
    }
  });
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch(err => {
      console.error("Unable to connect to the database:", err);
    });
  sequelize.sync();

  return sequelize;
};
