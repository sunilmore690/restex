# restex


Simple and minimalist API framework based on top of Expressjs with support mongoose & sequelizejs

##### Initialize restex using mongoose URL
  ```
const express = require("express"),
    RestEx = require("restex"),
    

//Restex connecting to mongodb using mongodb url
let restex = new RestEx(app, {
    database: {
        provider: "mongo",
        conn: {
            uri: "mongodb://localhost:27017/mydb"
        }
    },
    controllersPath: path.resolve(__dirname + "/controllers"),
    modelsPath: path.resolve(__dirname + "/models"),
    routesPath: path.resolve(__dirname + "/routes")
});
  ```
  
 ##### Initialize restex using existing mongoose connection instance 
  ```
const express = require('express'),
      mongoose = require('mongoose'),
      RestEx = require("restex");
      
let app = express()

const mongoose = require('mongoose');
 
// Basic usage
mongoose.connect(connectionOptions);
const mongooseConnection = mongoose.connection;

// Advanced usage
const mongooseConnection = mongoose.createConnection(connectionOptions);

//Restex connecting to mongodb using mongodb url
let restex = new RestEx(app, {
    database: {
        provider: "mongo",
        conn: {
            mongooseConnection:mongooseConnection
        }
    },
    controllersPath: path.resolve(__dirname + "/controllers"),
    modelsPath: path.resolve(__dirname + "/models"),
    routesPath: path.resolve(__dirname + "/routes")
});
  ```

##### controllersPath 
path to controllers directory
```
default : controllers
@type {string}
```
##### modelsPath 
path to models directory where you define mongoose schemas
```
default : models
@type {string}
```
##### routesPath 
path to routes directory where you define routes for app
```
default : routes
@type {string}
```

### Fixed File structure 

##### models
//user.js
```
module.exports = function(mongoose) {
  const Schema = mongoose.Schema;
  var userSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: Date
  });

  userSchema.pre("save", function() {
    if (this.isNew) {
      this.createdAt = new Date();
    } else {
      this.updatedAt = new DataCue();
    }
  });
  return userSchema
};
```

##### routes
//user.js

```
module.exports = function(router) {
  router.post("/authenticate", "user#authenticate");
};
```
###### Note: user#authenticate 
user >> controller 
authenticate >> handler defined in controller

If you need to add **middleware** to route
```
let middeware1 = function(req,res,next){
  next()
}
let middeware2 = function(req,res,next){
  next()
}
module.exports = function(router) {
  router.post("/authenticate", "user#authenticate",{middlware:[middeware1,middeware2]);
};

```
##### controllers 
//user.js
```
let model_name = 'user'// make sure user schema exist in models dir
module.exports = function(restex){
  let Dao = restex.model(model_name)
  let authenticate = function(req,res,next){
   //Using Promise then & catch
    Dao.get({email: req.body.email,password: req.body.password}).then(user=>{
        res.json(user)
    }).catch(err=>{
      return next(err)
    })
    
    // Using async/await
    try{
        let user = Dao.get({email: req.body.email,password: req.body.password})
    }catch(e){
      return next(e)
   }
  }
  return {
   authenticate
  }
}
```

#### Dao object consist of following predefined CURD methos
   1. ```Dao.get({email:email})).then(=>{}).catch(=>{})```
   2. ``` Dao.getAll({company:<company>},{page:1,limit:10}) ```
    3. ```Dao.destroy({email:email}).then(=>{}).catch(=>{})```
    4. ```Dao.update({email:email},{name:'Scott  Tiger'}).then(=>{}).catch(=>{})```
    5. ``` Dao.add({email:'scott@tiger.com',name:'Scott Tiger'}```
  
In some case if you need access mongoose Model directly.

```
const model_name = 'user'
module.exports = function(restex){
   let UserModel = restex.models[model_name]
   let authenticate = function(req , res,next){
      UserModel.findOne({email:req.body.email,password:req.body.password}).lean().then(user=>{
        res.json(user)
      }).catch(err=>{
        return next(err)
      })
   
   }
   return {
    authenticate
   }
}
  npm run build:admin
```
