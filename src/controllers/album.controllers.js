const albumModel = require("../models/album.model");
const jwt = require("jsonwebtoken")
require("dotenv").config();

const createAlbum = async (req, res) => {
    const token = req.cookie.token;

    if(!token){
        res.status(401).json({
            message:"Unauthorized"
        })
    }

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== "artist"){
            res.status(403).json({
                message :"You don't have access to create album"
            })
        }

        const {title, musics} = req.body;
        const album = await albumModel.create({
            title,
            artist:decoded.id,
            music: musics
        })

        res.status(201).json({
            message:"Album created successfully",
            album:{
                id:album._id,
                title:album.title,
                artist:album.artist,
                music:album.musics
            }
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal server error"
        })
    }

}

module.exports = { createAlbum }