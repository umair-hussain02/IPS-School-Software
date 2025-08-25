import { Router } from "express";
import {
  createAdmin,
  createClass,
  createSubject,
  registerStudent,
  registerTeacher,
} from "../admin/admin.controller";
import upload from "../../../config/multer";
import { authMiddleware } from "../../../middlerwares/auth.middlerware";

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

router.route("/create-subject").post(authMiddleware, createSubject);

router.route("/create-class").post(authMiddleware, createClass);

router.post(
  "/create-admin",
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  createAdmin
);

export default router;
