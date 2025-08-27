import { Router } from "express";
import { authMiddleware } from "../../middlerwares/auth.middlerware";
import {
  getStudentAttendance,
  markStudentAttendance,
  markTeacherAttendance,
} from "./attendance.controller";

const router = Router();

router.route("/student/mark").post(authMiddleware, markStudentAttendance);
router.route("/teacher/mark").post(authMiddleware, markTeacherAttendance);
router.route("/student/get").get(getStudentAttendance);

export default router;
