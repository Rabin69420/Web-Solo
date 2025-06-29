const {Sequelize} = require("sequelize")

const sequelize = new Sequelize("postgres", "postgres", "9828810791",{
    dialect : "postgres",
    host : "localhost",
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const connection = async() => {
    try{
        await sequelize.authenticate()
        console.log("database connected !!");
        await sequelize.sync()
        console.log("Database is Synced !");
    } catch (error) {
        console.error('Unable to connect to Database', error);
        process.exit(1);
    }
};

module.exports = {connection,sequelize}