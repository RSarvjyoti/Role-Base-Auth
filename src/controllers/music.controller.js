const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const uploadfile  = require("../services/storage.service");


const createMusic = async (req, res) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message:"Unautherized"})
    }

    try{
        // verify the token
       const decoded =  jwt.verify(token,process.env.JWT_SECRET)
       // verify the role
       if(decoded.role !== "artist"){
        return res.status(403).json({message:"You don't have access to create a music"})
       }

       const {title} = req.body
    const file = req.file

    const result = await uploadfile(file.buffer.toString("base64"))

    const music = await musicModel.create({
        uri:result.url,
        title,
        artist: decoded.id
    })

    res.status(201).json({
        message:"Music crested",
        music:{
            id:music._id,
            uri:music.uri,
            title:music.title,
            artist:music.artist
        }
    })

    }catch(err){
        console.log(err);
        
        return res.status(401).json({message:"Unautherized"})
    }

    
}

module.exports = {createMusic}