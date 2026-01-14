// auth.middleware.js
import jwt from "jsonwebtoken";

export function authMiddleware(req,res,next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({error:"Missing authorization header"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        req.user = {id:payload.userId};
        next();
    } catch {
        res.status(401).json({error:"Invalid or expired token"});
    }

}