import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { errorHandler, notFoundHandler } from "./middlerwares/error.middleware";
import healthRouter from "./modules/health/heath.route";
import adminRouter from "./modules/users/admin/admin.route";
import studentRouter from "./modules/users/student/student.route";
import teacherRouter from "./modules/users/teacher/teacher.route";
import loginRouter from "./modules/users/login.route";

const app = express();
// security Header
app.use(helmet());

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you’re using cookies/auth headers
  })
);

// logging request in development mode
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
// Limit request body size & compression
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests from this IP, please try again later.",
  })
);

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/login", loginRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/teacher", teacherRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
