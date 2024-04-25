import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
    if(req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {
                new: true
            })
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(403, "You can only modify your own account details!"));
    }
};

export const deleteUser = async (req, res, next) => {
    if(req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been successfully deleted!");
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(403, "You can only delete your own account details!"));
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const subscribe = async (req, res, next) => {
    if(req.params.id === req.user.id)
        return next(createError(403, "You cannot subscribe to yourself!"));

    const exists = await User.find({_id: req.params.id});

    if(exists.length === 0)
        return next(createError(403, "You cannot subscribe to a non-existant user!"));

    else {
        try {
            const data = await User.findById(req.user.id)
            data.subscribedUsers.forEach((e) => {
                if(e === req.params.id)
                    return next(createError(403, "You can only subscribe to a user once!"))
            })
    
            await User.findByIdAndUpdate(req.user.id, {
                $push: { subscribedUsers: req.params.id }
            });
            await User.findByIdAndUpdate(req.params.id, {
                $inc: { subscribers: 1 },
                $push: { whoSubscribed: req.user.id }
            });
            res.status(200).json("Subscription Successful!");
        } catch (error) {
            next(error);
        }
    }
}

export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannels.map((channelId) => (
                User.findById({ _id: channelId })
            ))
        );

        res.status(200).json(list);
    } catch (error) {
        next(error);
    }
}

export const mySubscribers = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user.whoSubscribed);
    } catch (error) {
        next(error);
    }
}

export const unsubscribe = async (req, res, next) => {
    if(req.params.id === req.user.id) 
        return next(createError(403, "You cannot unsubscribe to yourself!"));

    const exists = await User.find({_id: req.params.id});

    if(exists.length === 0)
        return next(createError(403, "You cannot unsubscribe to a non-existant user!"));

    else {
        try {
            const data = await User.findById(req.user.id)
            data.subscribedUsers.forEach((e) => {
                if(e !== req.params.id)
                    return next(createError(403, "You cannot unsubscribe to a non-subscribed user!"))
            })

            await User.findByIdAndUpdate(req.user.id, {
                $pull: { subscribedUsers: req.params.id }
            })
            await User.findByIdAndUpdate(req.params.id, {
                $inc: { subscribers: -1 },
                $pull: { whoSubscribed: req.user.id }
            });
            res.status(200).json("Unsubscription Successful!");
        } catch (error) {
            next(error);
        }
    }
}

export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        })
        res.status(200).json("You liked the video!");
    } catch (error) {
        next(error);
    }
}

export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        })
        res.status(200).json("You disliked the video!");
    } catch (error) {
        next(error);
    }
}