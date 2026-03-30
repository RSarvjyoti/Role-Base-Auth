const {Schema, model} = require("mongoose");

const musicSchema = new Schema({
    uri: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    artist:{
        type: Schema.Types.ObjectId,
        ref:"users",
        required: true
    }

})

const musicModel = model("music", musicSchema);
module.exports = musicModel;