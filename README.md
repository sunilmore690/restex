
<img  src='https://raw.githubusercontent.com/sunilmore690/restex/master/restex_logo.png'  style="max-height:200px"  alt='Restex Logo'>

  

  

# restex

  

  

Simple and minimalist API wrapper based on top of Expressjs with support mongoose & sequelizejs

  

  

**Note To**: For now I support only mongoose, very soon I'll come with sequelizejs

  

  

Requirements

  

You need **Node.js ^7.10.1** installed and you'll need MongoDB installed and running.

  

  

##### Initialize restex using mongodb database(mongoose) L

  
  

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
  controllersPath: path.resolve(__dirname + "/controllers"),//optional
  modelsPath: path.resolve(__dirname + "/models"), //optional
  routesPath: path.resolve(__dirname + "/routes"),//optinonal
  middlewaresPath:path.resolve(__dirname+"/middleware.js") //optional
});

```

##### Initialize restex using existing mongoose connection instance

  

```

const express = require('express');
const mongoose = require('mongoose');
const RestEx = require("restex");

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
     mongoose:require('mongoose'),
     conn: {
        mongooseConnection:mongooseConnection
     }
    },
    controllersPath: path.resolve(__dirname + "/controllers"),
    modelsPath: path.resolve(__dirname + "/models"),
    routesPath: path.resolve(__dirname + "/routes"),
    middlewaresPath: path.resolve(__dirname + "/middleware.js")
});
```

##### Initialize restex using sequelize ORM database

  
```
const express = require("express");
const Sequelize = require('sequelize');
const RestEx = require("restex");
let app = express()
//connect to sqlite database, you also need to in

const sequelize = new Sequelize('sqlite::memory:');
//Restex connecting to mongodb using mongodb url

let restex = new RestEx(app, {
	database: {
		provider : "sequelize",
		Sequelize : Sequelize,
		conn: sequelize
    },
    controllersPath: path.resolve(__dirname + "/controllers"),//optional
    modelsPath: path.resolve(__dirname + "/models"), //optional
    routesPath: path.resolve(__dirname + "/routes"),//optinonal
    middlewaresPath:path.resolve(__dirname+"/middleware.js") //optional
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

  

  

##### middlewaresPath

  

  

path to middleware file

  

  

```
default : middleware.js
@type {string}
```

  

  

### Follow the following file structurre for models,routes & controllers

  

  

##### models ()

  

##### 1 Mongodb(mongoose)

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
	userSchema.pre("save", function(next) {
		if (this.isNew) {
			this.createdAt = new Date();
		} else {
			this.updatedAt = new Date();
		}
	})

	userSchema.statics = {
		collectionName:modelName // default file name >>user,
	}
	return userSchema
};

```

##### 2 sequelize(Relational Database)

```

module.exports = function(sequelize,Sequelize){
    const modelName = 'user'
	const User = sequelize.define(modelName, {
		name: { type: Sequelize.STRING },
		email: { type: Sequelize.STRING }
	});
	User.statics = {
		collectionName:modelName // default file name >>user,
	}
	return User;
}
```

#### routes

  
  
  

//user.js

  

  

```

module.exports = function(router) {
  router.post("/authenticate", "user#authenticate");
};
```

  

  

###### Note: user#authenticate

  

  

*user* >> controller

  

*authenticate* >> handler defined in controller

  

  

  

#### Controllers

  

  

//users.js

```
const model_name = 'users'// make sure user schema exist in models dir
module.exports = function(restex){
	let Dao = restex.dao(model_name)
	let authenticate = function(req,res,next){
		//Using Promise then & catch
		Dao.get({email: req.body.email,password:req.body.password})
		.then(user=>{
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

  

  

##### middleware

  

  

//middleware.js

  

  

```
module.exports = function(restex){

  const middleware1 = function(req,res,next){
	const auth = true;
	if(auth){
		return next()
	}
	next({status:401,message:'Unauthorized})
  }
  const middleware2 = function(req,res,next){
	/paste your middleware snippet
	next();
  }
  return {
	middleware1,
	middleware2
  }
}

```

 
And you can directly use middleware name in routes file

```
const customMiddleware = function(req,res,next){
	returen next()
}
router.get('/users','user#show',{middleware:['middleware1','middleware2',customMiddleware]}

```

#### Dao object consist of following predefined CURD methos

  

1.  `Dao.get({email:email})).then(=>{}).catch(=>{})`

  

2.  `Dao.getAll({company:<company>},{page:1,limit:10})`

  

3.  `Dao.destroy({email:email}).then(=>{}).catch(=>{})`

  

4.  `Dao.update({email:email},{name:'Scott Tiger'}).then(=>{}).catch(=>{})`

  

5.  `Dao.add({email:'scott@tiger.com',name:'Scott Tiger'}`

  

  

In some case if you need access mongoose Model directly.

  

  

```
const model_name = 'users'
module.exports = function(restex){
	let UserModel = restex.model(model_name)
	let authenticate = function(req , res,next){
		UserModel.findOne({email:req.body.email,password:req.body.password}).lean()
		.then(user=>{
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

  

  
```
userSchema.statics = {
	collectionName:'users'
}
```
  

  

```

GET /users

DELETE /users/:id

PUT /users/:id

GET /users/:id

POST /users
```

  

  

To add middleware option for CRUD api ,add routeOption while defining mongoose model

  

  

```
userSchema.statics = {
	collectionName:'users',
	routeOption:{
	  middleware:['middleware1','middleware2']
	 }
}
```

  

  

#### examples

  

##### 1 Mongodb (mongoose)

```
git clone https://github.com/sunilmore690/restex-mongo-demo
cd restex-mongo-demo
npm install
npm start
```

  

##### 2 Sequelize (Relational Database)

[![Edit Button](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/express-restex-sequelize-demo-e1sv3p)

```

 git clone https://github.com/sunilmore690/restex-sequelize-demo

 cd restex-sequelize-demo

 npm install

 npm start

```