import { Router } from "express";
import { createSubject } from "./subject.controller";

const router = Router();

router.post("/create-subject", createSubject);

export default router;
