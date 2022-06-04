let cbFunction = function() {};

const crud = {
  add(data) {  
    return this.Model.create(data);
  },
  get(params, project, cb) {
    params = params || {};
    let query = this.Model.findOne({ where: params });
    return query;
  },
  getAll(params={}, attributes) {
    let query = this.Model.findAll({ where: params ,attributes});
    return query;
  },
  destory(params={}) {
    let query = this.Model.destory({ where: params });
    return query;
  },
  update(params, data) {
    return this.Model.update(data, { where: params });
  }
}

class Dao {
  constructor(app,{
    database,
    modelsPath,
    routesPath,
    controllersPath,
    middlewaresPath
  }) {
    this.modelPath = modelsPath;
    this.sequelize = database.conn;
    let models = require("./models_init")(this.sequelize,database.Sequelize ,modelsPath);
    this.models = models
    console.log('models',models)
    this.map = require('./route_init').call(this,app,models,controllersPath,modelsPath,routesPath,middlewaresPath)
  }
  model(model_name){
    let Model = this.models[model_name]
    return Model;
  }
  dao(model_name) {
    let Model = this.models[model_name];
    // console.log('Model',Model)
    if (!Model) {
      throw new Error(`Mongo Model ${model_name} not exist `);
    }
    return Object.assign({ Model }, crud);
  }
 
}
module.exports = Dao;
