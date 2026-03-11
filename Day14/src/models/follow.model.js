const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    follower:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    followee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps: true
});

const followModel = mongoose.model("Follow", followSchema);

module.exports = followModel;