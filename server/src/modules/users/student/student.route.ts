import { Router } from "express";
import { loginStudent } from "./student.controller";

const router = Router();

router.post("/", loginStudent);

export default router;
