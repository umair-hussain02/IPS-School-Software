import { Router } from "express";
import { authMiddleware } from "../../middlerwares/auth.middlerware";
import { markStudentAttendance } from "./attendance.controller";

const router = Router();

router.route("/student").post(authMiddleware, markStudentAttendance);

export default router;
