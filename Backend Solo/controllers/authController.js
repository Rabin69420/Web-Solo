const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const jwt_secret = process.env.JWT_SECRET || 'privatekey';
const jwt_expires_in = process.env.JWT_EXPIRES_IN || '3d';

const generatetoken = (userid, role) => {
    return jwt.sign({ userid, role }, jwt_secret, { expiresIn: jwt_expires_in });
}

const register = async (request, response) => {
    try {
        const errors = validationResult(request);
        
        if (!errors.isEmpty()) {
            return response.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg,
                    value: error.value
                }))
            });
        }

        const { firstName, lastName, username, email, password, gender } = request.body;
        
        const isEmailExist = await User.findByEmail(email);
        if (isEmailExist) {
            return response.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        const isUsernameExist = await User.findByUsername(username);
        if (isUsernameExist) {
            return response.status(409).json({
                success: false,
                message: "This username is already taken"
            });
        }

        const user = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password,
            gender,
            role: 'user',
            isActive: true
        });

        const token = generatetoken(user.id, user.role);

        return response.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    gender: user.gender,
                    role: user.role
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            return response.status(409).json({
                success: false,
                message: `${field} already exists`
            });
        }
        
        return response.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};

const login = async (request, response) => {
    try {
        const errors = validationResult(request);
        
        if (!errors.isEmpty()) {
            return response.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg
                }))
            });
        }

        const { email, password } = request.body;
        
        const user = await User.findByEmail(email.toLowerCase().trim());

        if (!user) {
            return response.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return response.status(401).json({
                success: false,
                message: "Your account has been deactivated. Please contact support."
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return response.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        await user.update({ lastLogin: new Date() });

        const token = generatetoken(user.id, user.role);

        return response.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    gender: user.gender,
                    role: user.role,
                    lastLogin: user.lastLogin
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return response.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

const getProfile = async (request, response) => {
    try {
        const user = request.user;
        
        return response.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: { user }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        return response.status(500).json({
            success: false,
            message: "Server error retrieving profile"
        });
    }
};

const logout = async (request, response) => {
    try {
        return response.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        return response.status(500).json({
            success: false,
            message: "Server error during logout"
        });
    }
};

module.exports = { 
    register,
    login, 
    getProfile,
    logout
};
