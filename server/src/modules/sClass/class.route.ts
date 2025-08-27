import { Router } from "express";
import { authMiddleware } from "../../middlerwares/auth.middlerware";
import { createClass, getAllClasses } from "./class.controller";

const router = Router();

router.post("/create-class", createClass);
router.get("/getAll-class", getAllClasses);

export default router;
