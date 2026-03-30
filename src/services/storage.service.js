const {ImageKit}  = require("@imagekit/nodejs")
require("dotenv").config();


const imagekitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

const uploadfile = async (file) => {
    const result = await imagekitClient.files.upload({
        file,
        fileName:"music_"+ Date.now(),
        folder:"spotify/music"
    })
    return result;
}

module.exports = uploadfile 