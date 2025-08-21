import { Router } from "express";
import { registerStudent, registerTeacher } from "../admin/admin.controller";
import upload from "../../../config/multer";

const router = Router();

router.post(
  "/",
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

export default router;
