const {Sequelize,Model,DataType,where, DataTypes, DATE} = require('sequelize');
const moment = require("moment"); // servira pour les dates
const Op = Sequelize.Op;// servira pour les recherches
const sequelize = new Sequelize({
    dialect:"sqlite",
    storage:"db.sqlite3"
})

class  User extends Model{}
class Products extends Model{}

User.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    username:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:true,
        primaryKey: false
    },
    email:{
        type:DataTypes.TEXT,
        allowNull: false,
    },
    password:{
        type:DataTypes.TEXT,
        unique:true,
        allowNull:false
    },
    adresse:{
        type:DataTypes.TEXT,
        unique:false,
        allowNull:false
    }
},{sequelize,modelName:'User'});


Products.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    manufacture:{
        type:DataTypes.STRING
    },

    price:{
        type:DataTypes.FLOAT,
        allowNull:false,
        defaultValue:0.0,
    },

    description:{
        type:DataTypes.TEXT,
        allowNull:false,

    }
},{sequelize, modelName:"Products"});


// see if we have to do a Order class
// if Yes , there'll have some primary keys



module.exports={
    getUser:  function getUser(username) {
        return User.findOne({where : { username: username}})
            .then(user=>{
                if(user){
                    return user;
                }
                else{
                    return false;
                }
            });
    },


    addUser : function addUser(username,password,email,adresse){
        return User.create({
            username:username,
            email:email,
            password:password,
            adresse:adresse
        }).then(user=>{
            console.log("User added : "+user);
            return true;
        }).catch(err=>{
            console.log("User already exists "+err);
            return false;
        })
    }
}



