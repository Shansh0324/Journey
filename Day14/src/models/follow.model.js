const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    follower:{
        type: String,
    },
    followee:{
        type: String,
    },
        status:{
        type: String,
        default: "pending",
        enum: {
            values: ["pending", "approved", "rejected"],
            message: "Status must be either pending, approved or rejected"
        }
    }
},{
    timestamps: true
});

followSchema.index({ follower: 1, followee: 1 }, { unique: true });

const followModel = mongoose.model("Follow", followSchema);

module.exports = followModel;