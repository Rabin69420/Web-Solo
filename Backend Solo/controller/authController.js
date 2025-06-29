const {Users} = require("../model/userSchema")
const {jwt} = require("jsonwebtoken")
const {Op} = require("sequelize")
const{validationResult} = require("express-validator")

const JWT_SECRET = process.env.JWT_SECRET || 'privateKey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3d';

const generateToken = (userId) => {
    return jwt.sign({userId}, JWT_SECRET, {expiresIn : JWT_EXPIRES_IN})
}


const registerController = async(request, response) => {
    try{

        const error = validationResult(request)
    
        if(!error.isEmpty()){
        return response.json({
            success: false,
            message : "error on validarion",
            error: error.array(),
        });
    }

        const {fullName, email, password} = request.body
        const isEmailExist = await Users.findOne({
            where: {
                [Op.or]:[{email} 
                ]
            }
        })

        if(isEmailExist){
            return response.status(400).json({
                success: false,
                message: "This email is already in use"
            });
        }
        const user = await Users.create(
        {
            fullName,
            email,
            password
        });

        const token = generateToken(user.id);

        return response.status(201).json({
            success: true,
            message: "Account Created Successfully",
            data: {
                user: {
                    id: user.id,
                    fullName : user.fullName,
                    email: user.email
                },
                token
            }
        });
    }
    catch(error){
        return response.json({
            success: false,
            message: error,
        });
    };
}

const loginController = (request, response) => {
    
}


const getProfileController = (request, response) => {
    
}

module.exports = {registerController}