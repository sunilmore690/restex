let cbFunction = function() {};
const crud = {
  add(data, cb) {
    if (typeof cb != "function") cb = cbFunction;
    let model = new this.Model(data);
    return new Promise((resolve, reject) => {
      model.save(function(err, obj) {
        if (err) reject(err);
        else resolve(obj);
      });
    });
  },
  get(params, project, cb) {
    params = params || {};
    if (typeof cb != "function") cb = cbFunction;
    let query = this.Model.findOne(params, project).lean();
    return query;
  },
  getAll(params, options, cb) {

    params = params || {};
    if (typeof cb != "function") cb = cbFunction;
    options = options || {};
  
    return this.Model.paginate(params, options);
  },
  destroy(params, cb) {
    params = params || {};
    if (typeof cb != "function") cb = cbFunction;
    let query = this.Model.remove(params);
    return new Promise((resolve, reject) => {
      query.exec(function(err, data) {
        if (err) reject(err);
        return resolve(data);
      });
    });
  },
  update(params, data, multi, cb) {
    params = params || {};
    multi = multi || false;
    if (typeof cb != "function") cb = cbFunction;
    let query = this.Model.update(params, { $set: data }, { multi });
    return new Promise((resolve, reject) => {
      query.exec(function(err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
};
let models = []
class Dao {
  constructor(app,{database:{mongoose,conn:{mongooseConnection,uri}},controllersPath,modelsPath,routesPath,middlewaresPath}) {
    // console.log('options',options)
    // console.log('app',app)
    if (mongooseConnection) {
      this.mongoose = mongooseConnection;
    } else {
      // console.log('uri',uri)
      mongoose.set('debug',true)
      this.mongoose = mongoose.createConnection(uri,{useNewUrlParser:true});
    }
    models = require("./models_init")(this.mongoose ,mongoose,modelsPath);
    this.map = require('./route_init').call(this,app,models,controllersPath,modelsPath,routesPath,middlewaresPath)
  }
  dao(model_name) {
    let Model = models[model_name];
    // console.log('Model',Model)
    if (!Model) {
      throw new Error(`Mongo Model ${model_name} not exist `);
    }
    return Object.assign({ Model }, crud);
  }
  model(model_name) {
    let Model = models[model_name];
    // console.log('Model',Model)
    if (!Model) {
      throw new Error(`Mongo Model ${model_name} not exist `);
    }
    return Model;
  }

}
module.exports = Dao;
