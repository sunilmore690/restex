import fs from 'fs';
import path from 'path';
import express from 'express';

/**
 * Initialize routes for the application
 * @param {Object} app - Express application instance
 * @param {Object} models - Initialized models
 * @param {String} controllersPath - Path to controllers directory
 * @param {String} modelsPath - Path to models directory
 * @param {String} routesPath - Path to routes directory
 * @param {String} middlewaresPath - Path to middleware file
 * @returns {Object} - Object containing route mappings
 */
export default function(app, models, controllersPath, modelsPath, routesPath, middlewaresPath) {
  const routeMap = {};
  let middlewares = {};

  // Load middleware if exists
  if (fs.existsSync(middlewaresPath)) {
    // We need to use require here since we're loading user-defined middleware
    middlewares = require(middlewaresPath)(this);
  }

  // Create CRUD routes for each model
  Object.keys(models).forEach(modelName => {
    const model = models[modelName];
    const routeOption = model.statics ? model.statics.routeOption || {} : {};
    const middlewareList = routeOption.middleware || [];

    // Create router for the model
    const router = express.Router();
    
    // Apply middleware to router
    if (middlewareList.length > 0) {
      router.use(middlewareList.map(middleware => {
        if (typeof middleware === 'function') {
          return middleware;
        }
        return middlewares[middleware];
      }));
    }

    // Define CRUD routes
    router.get('/', async (req, res, next) => {
      try {
        const dao = this.dao(modelName);
        const result = await dao.getAll({});
        res.json(result);
      } catch (err) {
        next(err);
      }
    });

    router.get('/:id', async (req, res, next) => {
      try {
        const dao = this.dao(modelName);
        const result = await dao.get({ id: req.params.id });
        res.json(result);
      } catch (err) {
        next(err);
      }
    });

    router.post('/', async (req, res, next) => {
      try {
        const dao = this.dao(modelName);
        const result = await dao.add(req.body);
        res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    });

    router.put('/:id', async (req, res, next) => {
      try {
        const dao = this.dao(modelName);
        const result = await dao.update({ id: req.params.id }, req.body);
        res.json(result);
      } catch (err) {
        next(err);
      }
    });

    router.delete('/:id', async (req, res, next) => {
      try {
        const dao = this.dao(modelName);
        const result = await dao.destroy({ id: req.params.id });
        res.json(result);
      } catch (err) {
        next(err);
      }
    });

    // Mount router to app
    app.use(`/${modelName}`, router);
    routeMap[modelName] = router;
  });

  // Load custom routes if exists
  if (fs.existsSync(routesPath)) {
    fs.readdirSync(routesPath).forEach(file => {
      const file_name = path.parse(file).name;
      const router = express.Router();
      
      // We need to use require here since we're loading user-defined routes
      require(path.join(routesPath, file))(router);
      
      // Parse routes and load controllers
      router.stack.forEach(route => {
        if (route.route) {
          const path = route.route.path;
          const method = Object.keys(route.route.methods)[0];
          
          // Parse controller#action format
          if (typeof route.route.stack[0].handle === 'string') {
            const [controller, action] = route.route.stack[0].handle.split('#');
            
            // Load controller
            const controllerPath = path.join(controllersPath, `${controller}.js`);
            if (fs.existsSync(controllerPath)) {
              const controllerModule = require(controllerPath)(this);
              route.route.stack[0].handle = controllerModule[action];
            }
          }
        }
      });
      
      // Mount router to app
      app.use(`/${file_name}`, router);
      routeMap[file_name] = router;
    });
  }

  return routeMap;
}