import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware.js";
import limiter from "./middleware/ratelimitermiddleware.js";

// Import routes
import authRouter from "./modules/auth/auth.routes.js";
import adminRouter from "./modules/admin/admin.routes.js";
import managerRouter from "./modules/manager/manager.routes.js";
import employeeRouter from "./modules/employee/employee.routes.js";
import profileRouter from "./modules/profile/profile.routes.js";
import groupRouter from "./modules/group/group.routes.js";
import userRouter from "./modules/user/user.routes.js";

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
