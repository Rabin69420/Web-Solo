const sequelize = require("sequelize")

const sequelize = new Sequelize("postgres", "postgres", "9828810791",{
    dialect : "postgres",
    host : "localhost"
})

const connection = async() => {
    try{
        await sequelize.authenticate()
        console.log("database connected !!");
    } catch (error) {
        console.log(error);
    }
};

module.exports = {connection,sequelize}