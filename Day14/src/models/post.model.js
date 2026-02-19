const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    caption : {
        type : String,
        default : ""
    },
    imgUrl : {
        type : String,
        required : [true, "Image URL is required"]
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : [true, "User reference is required"]
    }
});

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;