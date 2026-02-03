// backend/src/server.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import pool from "./db/index.js"
import authRoutes from "./routes/auth.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import membershipRoutes from "./routes/membership.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";


const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true 
}));

app.use(express.json());


app.use("/auth",authRoutes);
app.use("/organizations", authMiddleware, organizationRoutes);
app.use("/organizations/:orgId/members", authMiddleware, membershipRoutes);
app.use("/organizations/:orgId/projects", authMiddleware, projectRoutes);
app.use("/organizations/:orgId/projects/:projectId/tasks", authMiddleware, taskRoutes);


app.get("/health", async (req,res) => {
    try {
        await pool.query("SELECT 1");
        res.json({status:"ok", db:"connected"});
    } catch (err) {
        console.log(err);
        res.json({status:"error",db:"disconnected"});
    }
});

app.get("/protected", authMiddleware, (req,res) => {
    res.json({message:"Access Granted", userId : req.user.id});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})