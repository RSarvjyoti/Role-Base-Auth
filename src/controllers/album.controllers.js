const albumModel = require("../models/album.model");

const createAlbum = async (req, res) => {
    // const token = req.cookies.token;
    
    // if(!token){
    //     res.status(401).json({
    //         message:"Unauthorized"
    //     })
    // }

    try{

        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // if(decoded.role !== "artist"){
        //     res.status(403).json({
        //         message :"You don't have access to create album"
        //     })
        // }

        const {title, musics} = req.body;
        const album = await albumModel.create({
            title,
            artist:req.user.id,
            musics: musics
        })

        res.status(201).json({
            message:"Album created successfully",
            album:{
                id:album._id,
                title:album.title,
                artist:album.artist,
                musics:album.musics
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