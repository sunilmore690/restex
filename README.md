# restex


**Note To**: For now I support only mongoose, very soon I'll come with sequelizejs

Requirements
You need Node.js ^7.10.1 installed and you'll need MongoDB installed and running.


Simple and minimalist API framework based on top of Expressjs with support mongoose & sequelizejs

##### Initialize restex using mongoose URL

```
const express = require("express"),
    RestEx = require("restex");

let app = express()
    

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

### Follow the following file structurre for models,routes & controllers

##### models
//user.js
```
module.exports = function(mongoose) {
  let modelName = 'users';
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
  userSchema.statics = {
    collectionName:modelName // default file name >>user
  }
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
  router.post("/authenticate", "user#authenticate",{middleware:[middeware1,middeware2]);
};

```
##### controllers 
//users.js
```
let model_name = 'users'// make sure user schema exist in models dir
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
const model_name = 'users'
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
```

#### Automatic CRUD API creation

by default CRUD api will be created according to collectionName provided in mongoose Schema

 userSchema.statics = {
    collectionName:'users' 
 }

```
 GET      /users
 DELETE   /users/:id
 PUT      /users/:id
 GET      /users/:id
 POST     /users

```
To add middlware option for CRUD api ,add routeOption while defining mongoose model

```
let middleware1 = function(req,res,next){
  //middleware1
}
let middleware2 = function(req,res,next){
  //middleware1

}
 userSchema.statics = {
    collectionName:'users',
    routeOption:{
        middleware:[middleware1,middleware2]
    } 
 }

```

#### examples


```
$ git clone https://github.com/sunilmore690/restex-mongo-demo
$ cd restex-mongo-demo
$ npm install
$ npm start
```

