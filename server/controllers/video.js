import { createError } from "../error.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body });
    try {
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
    } catch (error) {
        next(error);
    }
}

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if(!video) {
            return next(createError(404, "Video not found!"));
        }
        if(req.user.id === video.userId) {
            const updateVideo = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {
                new: true
            })
            res.status(200).json(updateVideo);
        } else {
            return next(createError(403, "You can only update your own video!"));
        }
    } catch (error) {
        next(error);
    }
}

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if(!video) {
            return next(createError(404, "Video not found!"));
        }
        if(req.user.id === video.userId) {
            await Video.findByIdAndDelete(req.params.id)
            res.status(200).json("The video has been successfully deleted!");
        } else {
            return next(createError(403, "You can only delete your own video!"));
        }
    } catch (error) {
        next(error);
    }
}

export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);
    } catch (error) {
        next(error);
    }
}

export const addView = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1}
        });
        res.status(200).json("This video gained a view!");
    } catch (error) {
        next(error);
    }
}

export const random = async (req, res, next) => {
    try {
        const video = await Video.aggregate([{ $sample: { size: 40 }}]);
        res.status(200).json(video);
    } catch (error) {
        next(error);
    }
}

export const trend = async (req, res, next) => {
    try {
        const video = await Video.find().sort({views: -1});
        res.status(200).json(video);
    } catch (error) {
        next(error);
    }
}

export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

export const getByTags = async (req, res, next) => {
    const tags = req.query.tags.split(",")
    try {
        const video = await Video.find({ tags: { $in: tags }}).limit(20);

        if(video.length === 0)
            return next(createError(404, `Video not found with the tags: ${req.query.tags}!`));

        res.status(200).json(video);
    } catch (error) {
        next(error);
    }
}

export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
        const videos = await Video.find({ title: {
            $regex: query,
            $options: "i"
        }}).limit(40);
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
}