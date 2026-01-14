// server.js
import express from "express";
import "dotenv/config";
import pool from "./db/index.js"
import authRoutes from "./routes/auth.routes.js"
import { authMiddleware } from "./middleware/auth.middleware.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(express.json());


app.use("/auth",authRoutes);
app.use("/orgs", projectRoutes);
app.use("/orgs/:orgId/projects/:projectId", taskRoutes);

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