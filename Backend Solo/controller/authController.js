const {Users} = require("../model/userSchema")
const{validationResult} = require("express-validator")


const registerController = async(request, response) => {
    const error = validationResult(request)
    
    if(!error.isEmpty()){
        return response.json({
            success: false,
            message : "error on validarion",
            error: error.array(),
        })
    }

    const {fullName, email, password} = request.body
    try{
        const isEmailExist = await Users.findOne({
            where: {
                email
            }
        })

        if(i1sEmailExist){
            return response.json({
                success: false,
                message: "This email is already in use"
            })
        }
    await Users.create(
        {
            fullName,
            email,
            password
        });

        return response.json({
            success: true,
            message: "Account Created Successfully",
        })
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