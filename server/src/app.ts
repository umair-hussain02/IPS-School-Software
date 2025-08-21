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

const app = express();
// security Header
app.use(helmet());

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// logging request in development mode
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
// Limit request body size & compression
app.use(express.json({ limit: "10kb" }));
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
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/student", studentRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
