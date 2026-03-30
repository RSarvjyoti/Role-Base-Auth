const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken");
const bcrypt =  require("bcrypt");
require("dotenv").config();

const register = async (req, res) =>{
    const {username, email, password, role="user"} = req.body
    try{
        const userExist = await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        });

        if(!userExist){
            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await userModel.create({
                username,
                email,
                password:hashedPassword,
                role
            })

            // generate token
            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET)

            //token saved in cookie
            res.cookie("token", token)
            res.status(201).json({
                message:"User register successfully!",
                user
            })

        }else{
            res.status(409).json({
                message: "User already exist"
            })
        }

    }catch(err){
        console.log(err);
        
        res.status(500).json({
            message: "Enternal server error"
        })
    }
}

module.exports = {register}