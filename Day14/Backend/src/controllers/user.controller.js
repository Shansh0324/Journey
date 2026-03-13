const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");


// FOLLOW REQUEST
async function followUserController(req, res) {
    try {

        const followerUsername = req.user.username;
        const followeeUsername = req.params.username;

        // prevent self follow
        if (followerUsername === followeeUsername) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        // check user exists
        const userExists = await userModel.findOne({
            username: followeeUsername
        });

        if (!userExists) {
            return res.status(404).json({
                message: "User to follow not found"
            });
        }

        // check existing follow
        const existingFollow = await followModel.findOne({
            follower: followerUsername,
            followee: followeeUsername
        });

        if (existingFollow) {
            return res.status(400).json({
                message: "Follow request already sent or already following"
            });
        }

        const followRecord = await followModel.create({
            follower: followerUsername,
            followee: followeeUsername,
            status: "pending"
        });

        res.status(200).json({
            message: `Follow request sent to ${followeeUsername}`,
            follow: followRecord
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}


// APPROVE FOLLOW REQUEST
async function approveFollowController(req, res) {
    try {

        const followeeUsername = req.user.username;
        const followerUsername = req.params.username;

        const followRecord = await followModel.findOneAndUpdate(
            {
                follower: followerUsername,
                followee: followeeUsername,
                status: "pending"
            },
            {
                status: "approved"
            },
            { new: true }
        );

        if (!followRecord) {
            return res.status(404).json({
                message: "Follow request not found"
            });
        }

        res.status(200).json({
            message: `${followerUsername} is now following you`,
            follow: followRecord
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}


// REJECT FOLLOW REQUEST
async function rejectFollowController(req, res) {
    try {

        const followeeUsername = req.user.username;
        const followerUsername = req.params.username;

        const followRecord = await followModel.findOneAndUpdate(
            {
                follower: followerUsername,
                followee: followeeUsername,
                status: "pending"
            },
            {
                status: "rejected"
            },
            { new: true }
        );

        if (!followRecord) {
            return res.status(404).json({
                message: "Follow request not found"
            });
        }

        res.status(200).json({
            message: "Follow request rejected",
            follow: followRecord
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}


// UNFOLLOW USER
async function unfollowUserController(req, res) {
    try {

        const followerUsername = req.user.username;
        const followeeUsername = req.params.username;

        if (followerUsername === followeeUsername) {
            return res.status(400).json({
                message: "You cannot unfollow yourself"
            });
        }

        const followRecord = await followModel.findOneAndDelete({
            follower: followerUsername,
            followee: followeeUsername
        });

        if (!followRecord) {
            return res.status(404).json({
                message: `You are not following ${followeeUsername}`
            });
        }

        res.status(200).json({
            message: `You have unfollowed ${followeeUsername}`,
            unfollow: followRecord
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}


module.exports = {
    followUserController,
    approveFollowController,
    rejectFollowController,
    unfollowUserController
};