import { Router } from "express";
import { registerTeacher } from "../admin/admin.controller";
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

export default router;
