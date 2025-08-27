import { Router } from "express";
import {
  createAdmin,
  getAllStudents,
  getAllTeachers,
  registerStudent,
  registerTeacher,
} from "../admin/admin.controller";
import upload from "../../../config/multer";

const router = Router();

router.post(
  "/create-teacher",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },
    { name: "otherDocuments", maxCount: 5 },
  ]),
  registerTeacher
);

router.post(
  "/create-student",
  upload.fields([
    { name: "bForm", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },
  ]),
  registerStudent
);

router.post(
  "/create-admin",
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  createAdmin
);

router.get("/get-all-students", getAllStudents);
router.get("/get-all-teachers", getAllTeachers);

export default router;
