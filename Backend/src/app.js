import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import tasksRoutes from "./routes/tasks.js";
import dashboardRoutes from "./routes/dashboard.js";
import todosRoutes from "./routes/todos.js";
import timeEntriesRoutes from "./routes/timeEntries.js";

const app = express();

// Middleware
app.use(cors({ 
  origin: ["http://localhost:3000", "http://localhost:5173"], 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/todos", todosRoutes);
app.use("/api/time-entries", timeEntriesRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "TrackHub API is running" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong" });
});

export default app;
