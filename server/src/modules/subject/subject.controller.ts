import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Subject } from "./subject.model";

// Create New Subject
export const createSubject = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Header: ", req.headers);

    console.log("Body: ", req.body);

    const { name, code, classId, teacherId, ...rest } = req.body;

    // request Validation
    if (!name || !code || !classId || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "Please provide * all required fields",
      });
    }
    // Create Subject
    const newSubject = await Subject.create({
      name,
      code,
      classId,
      teacherId,
      ...rest,
    });

    res.status(201).json({ success: true, data: newSubject });
  }
);
