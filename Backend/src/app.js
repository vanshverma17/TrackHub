import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import tasksRoutes from "./routes/tasks.js";
import dashboardRoutes from "./routes/dashboard.js";
import todosRoutes from "./routes/todos.js";
import timeEntriesRoutes from "./routes/timeEntries.js";
import timetableRoutes from "./routes/timetable.js";

const app = express();

// Middleware - CORS MUST come before routes
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://track-hub-dun.vercel.app"
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/todos", todosRoutes);
app.use("/api/time-entries", timeEntriesRoutes);
app.use("/api/timetable", timetableRoutes);

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