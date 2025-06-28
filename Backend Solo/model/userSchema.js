const {sequelize} = require("../database/db")
const {DataTypes, INTEGER} = require("sequelize")

const Users = sequelize.define("User",{
    id: {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull : false,
        validate:{
            len : [5,10],
            notEmpty: true
        },
    email: {
        type: DataTypes.STRING,
        allowNull : false,
        validate:{
            notEmpty: true,
            isEmail : true
        } 
    },

    password: {
        type: DataTypes.STRING,
        allowNull : false,
        validate:{
            len : [8],
            notEmpty: true
        },
    }
}
});


module.exports = {Users}