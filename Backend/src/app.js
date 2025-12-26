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

// If you ever use cookies behind Render/Proxies, keep this:
app.set("trust proxy", 1);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "https://track-hub-dun.vercel.app", // your prod URL (add your custom domain here too if you have one)
]);

const corsOptions = {
  origin: (origin, cb) => {
    // allow non-browser tools (curl/postman) which may send no Origin
    if (!origin) return cb(null, true);

    // allow exact matches
    if (allowedOrigins.has(origin)) return cb(null, true);

    // allow Vercel preview deployments (e.g. https://trackhub-git-branch-xxx.vercel.app)
    try {
      const { hostname } = new URL(origin);
      if (hostname.endsWith(".vercel.app")) return cb(null, true);
    } catch {
      // ignore URL parse errors
    }

    return cb(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/todos", todosRoutes);
app.use("/api/time-entries", timeEntriesRoutes);
app.use("/api/timetable", timetableRoutes);

app.get("/", (req, res) => res.json({ message: "TrackHub API is running" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong" });
});

export default app;