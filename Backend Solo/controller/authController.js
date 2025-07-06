const {Users} = require("../model/userSchema")
const {jwt} = require("jsonwebtoken")
const {Op, where} = require("sequelize")
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
            message : "error on validation",
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

const loginController = async(request, response) => {
    try{
        const {email,password} = request.body;
        if(!email||!password){
            return response.json({message:"Both field must be filled",
                success:false
            })
        }
        const userDetails = await user.findOne({
            where : {
                email:email
            }
        })
        if (!userDetails) {
            return response.json({message: "You are not registered yet", success : false})
        }
        
        const hashedP = bcrypt.compare(password, userDetails,password);

        if (!hashedP) {
            return response.json({message: " We Need Password to Login. Don't you know ??"})
        }

        return response.json({message: "Logged IN Successfully...."})
    }
    catch (error){
        

    }
    
}


const getProfileController = (request, response) => {
    
}

module.exports = {registerController, loginController}