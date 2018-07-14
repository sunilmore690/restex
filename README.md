# restex


Simple and minimalist API framework based on top of Expressjs with support mongoose & sequelizejs

##### Initialize restex using mongoose URL
.
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
 .
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

##### controllers 
//user.js
```
let model_name = 'user'// make sure user schema exist in models dir
module.exports = function(restex){
  let UserDao = restex.model(model_name)
  let authenticate = function(req,res,next){
   //Using Promise then & catch
    UserDao.get({email: req.body.email,password: req.body.password}).then(user=>{
        res.json(user)
    }).catch(err=>{
      return next(err)
    })
    //Using async/await
    try{
        let user = UserDao.get({email: req.body.email,password: req.body.password})
    }catch(e){
      return next(e)
   }
    
  }
  
  return {
   model_name,
   authenticate
  }

}


```

Existing Methods of Dao

// all crud api exist in UserDao
  /*
   1. UserDao.get({email:email})).then(=>{}).catch(=>{})
   2. UserDao.getAll({company:<company>},{page:1,limit:10}).then(result=>{
        
        result >> {
            "docs": [
             ],
            "total": 1,
            "limit": 10,
            "offset": 0,
            "page": 1,
            "pages": 1
        }
        
      }).catch(=>{
      
      })
    3. UserDao.destroy({email:email}).then(=>{}).catch(=>{})
    4. UserDao.update({email:email},{name:'Scott Tiger'}).then(=>{}).catch(=>{})
    5. UserDao.add({email:'scott@tiger.com',name:'Scott Tiger'}
  
  
  */
