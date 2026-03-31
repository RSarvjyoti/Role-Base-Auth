const jwt = require("jsonwebtoken");
require("dotenv").config();


const authArtist = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            messsage:"Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded.role !== "artist"){
            return res.status(403).json({
                message:"You don't have an access"
            })
        }
        req.user = decoded
        next()

    }catch(err){
        console.log(err);
        res.status(401).json({
            message:"Internal server error"
        })
    }
}

const authUser = async(req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        res.status(401).json({
            message:"Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded.role !== "user", decoded.role !== "artist"){
            return res.status(403).json({
                message: "you don't have access."
            })
        }
        req.user = decoded
        next()
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message : "Internal server error"
        })
    }
}

module.exports = {authArtist, authUser}