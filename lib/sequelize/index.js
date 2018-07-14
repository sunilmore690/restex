let cbFunction = function() {};

const crud = {
  add(data, cb) {
    if (typeof cb != "function") cb = cbFunction;
    return this.Model.create(data);
  },
  get(params, project, cb) {
    params = params || {};
    if (typeof cb != "function") cb = cbFunction;
    let query = this.Model.findOne({ where: params });
    return query;
  },
  getAll(params, project, cb) {
    params = params || {};
    if (typeof cb != "function") cb = cbFunction;
    let query = this.Model.findAll({ where: params });
    return query;
  },
  destory(params, cb) {
    params = params || {};
    if (typeof cb != "function") cb = cbFunction;
    let query = this.Model.destory({ where: params });
    return query;
  },
  update(params, data, multi, cb) {
    params = params || {};
    multi = multi || false;
    if (typeof cb != "function") cb = cbFunction;
    return this.Model.update(data, { where: params });
  }
}
class Dao {
  constructor(app,{
    db: { datbase_name, user, password,options:{host,port}},
    modelsPath,
    routesPath,
    controllersPath
  }) {
    this.modelPath = modelsPath;
    this.sequelize = require("./sequelize")({
      datbase_name,
      user,
      password,
      options
    });
    this.models = require("./models_init")(this.sequelize, modelsPath);
  }
  model(model_name){
    let Model = this.models[model_name]
    return Object.assign({Model},crud)
  }
 
}
module.exports = Dao;
