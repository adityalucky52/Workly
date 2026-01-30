import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware.js";
import limiter from "./middleware/ratelimitermiddleware.js";

// Import routes
import authRouter from "./routes/auth.Routes.js";
import adminRouter from "./routes/admin.routes.js";
import managerRouter from "./routes/manager.routes.js";
import employeeRouter from "./routes/employee.routes.js";
import profileRouter from "./routes/profile.routes.js";
import groupRouter from "./routes/group.routes.js";
import userRouter from "./routes/user.Routes.js";

const app = express();

// CORS Configuration - Allow frontend to connect
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Vite default ports
  credentials: true, // Allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Workly API is running", version: "1.0.0" });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/manager", managerRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/profile", profileRouter);
app.use("/api/user", userRouter);
app.use("/api/groups", groupRouter);

// Error handling middleware
app.use(errorMiddleware);

export default app;
