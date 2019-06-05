const path = require("path"),
  fs = require("fs");
var colors = require("colors/safe");
let actionMethods = {
  index: { action: "get", route: "/{controller_name}" },
  destroy: { action: "delete", route: "/{controller_name}/:id" },
  update: { action: "put", route: "/{controller_name}/:id" },
  show: { action: "get", route: "/{controller_name}/:id" },
  create: { action: "post", route: "/{controller_name}" }
};
const testmiddleware = function(req,res,next){

  return next()

}
let baseMethods = function(dao) {
  let create = function(req, res, next) {
    let body = req.body;
    dao
      .add(body)
      .then(function(data) {
        res.json(data);
      })
      .catch(function(e) {
        return next(e);
      });
  };
  let index = async function(req, res, next) {
    let page = req.query.page ? parseInt(req.query.page) : 1,
      limit = req.query.limit ? parseInt(req.query.limit) : 10;
    delete req.query.page;
    delete req.query.limit;
    dao
      .getAll(req.query, { page, limit })
      .then(data => {
        // console.log("data", data);
        res.json(data);
      })
      .catch(err => {
        // console.log("err", err);
        return next(err);
      });
  };
  let show = function(req, res, next) {
    dao
      .get({ _id: req.params.id })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        return next(err);
      });
  };
  let destroy = function(req, res, next) {
    dao
      .destory({ _id: req.params.id })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        return next(err);
      });
  };
  let update = function(req, res, next) {
    delete req.body._id;
    let multi = false;
    dao
      .update({ _id: req.params.id }, req.body, multi)
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        next(err);
      });
  };
  return {
    create,
    index,
    show,
    destroy,
    update
  };
};

/* GET home page. */

module.exports = function(
  app,
  models,
  controllerPath,
  modelsPath,
  routesPath,
  middlewaresPath
) {
  let that = this;
  let controller = {};
  var middleware = {};
  let handlAction = function(route, handler, options) {
    console.log(colors.red(this.action.toUpperCase()), colors.green(route));
    options = options || { middleware: [] };

    let reqHandler;
    if (typeof handler == "function") {
      reqHandler = handler;
    } else if (typeof handler == "string") {
      let controller_name = handler.split("#")[0],
        action = handler.split("#")[1];
      if (!controller[controller_name]) {
        throw new Error(`controller, ${controller_name} not exists`);
      } else if (!controller[controller_name][action]) {
        throw new Error(
          `${action} handler not found for ${route} in  ${controller_name} controller`
        );
      } else if (typeof controller[controller_name][action] != "function") {
        throw new Error(
          `Expetcing callback funciton for ${route} but got an object `
        );
      }
      reqHandler = controller[controller_name][action];
    } else {
      throw new Error(`handler not found for ${route}`);
    }
    if (
      options.middleware &&
      Array.isArray(options.middleware) &&
      options.middleware.length
    ) {
      let middlewares = options.middleware.map(function(midd) {
        if(typeof midd == 'string'){
          if(typeof middleware[midd] != 'function'){
             throw new Error(`Middleware file ${midd} not found in middlewares dir`)
          }
          return middleware[midd];
        }else if(typeof midd == 'function'){
          return midd;
        }else{
          return testmiddleware;
        }
        
      });
      app[this.action](route, ...middlewares, reqHandler);
    } else {
      app[this.action](route, reqHandler);
    }
  };

  let map = {};
  ["post", "delete", "get", "options","put"].forEach(function(action) {
    map[action] = handlAction.bind({ action: action });
  });
  //controller
  if (fs.existsSync(controllerPath)) {
    fs.readdirSync(controllerPath).forEach(file => {
      let controllerMethods = require(controllerPath + "/" + file)(this);
      let controller_name = path.parse(file).name;
      controller[controller_name] = controllerMethods;
    });
  }
  //middleware
  // console.log('middlewaresPath',middlewaresPath)
  if (fs.existsSync(middlewaresPath)) {
    middleware = require(middlewaresPath)(this);
  }
  // console.log('middleware',middleware)
  //models
  if (fs.existsSync(routesPath)) {
    fs.readdirSync(routesPath).forEach(file => {
      require(routesPath + "/" + file)(map);
    });
  }
  Object.keys(models).forEach(function(model_name) {
    let daoModel = that.dao(model_name);
    let Model = models[model_name];
    let default_methods = baseMethods(daoModel);
    Object.keys(actionMethods).forEach(function(key) {
      let route = actionMethods[key].route.replace(
        "{controller_name}",
        model_name
      );
      let action = actionMethods[key].action;
      let middlewareOption = {};
      if (
        Model.schema &&
        Model.schema.statics &&
        Model.schema.statics.routeOption
      ) {
        middlewareOption = Model.schema.statics.routeOption;
      }
      handlAction.call(
        { action },
        route,
        default_methods[key],
        middlewareOption
      );
    });
  });

  

  return map;
};
