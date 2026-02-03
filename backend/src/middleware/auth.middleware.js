// backend/src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";

export function authMiddleware(req,res,next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({error:"MISSING_AUTHOZATION_HEADER"});
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "INVALID_AUTHORIZATION_FORMAT" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        req.user = {id:payload.userId};
        next();
    } catch {
        res.setHeader("Content-Type", "application/json");
        return res.status(401).json({ error: "AUTH_TOKEN_INVALID" });
    }

}