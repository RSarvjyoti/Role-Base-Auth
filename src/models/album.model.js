const {Schema, model} = require("mongoose");

const albumSchama = new Schema({
    title:{
        type : String,
        required: true
    },
    musics:[{
        type: Schema.Types.ObjectId,
        ref:"music"
    }],
    artist:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    }
})

const albumModel = model("album", albumSchama);

module.exports = albumModel;