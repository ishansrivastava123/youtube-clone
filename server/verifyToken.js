import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token)
        return next(createError(401, "Please Login or Sign in"));

    jwt.verify(token, process.env.JWT, (err, user) => {
        if(err)
            return next(createError(403, "Invalid Token!"));
        req.user = user;
        next();
    });
}