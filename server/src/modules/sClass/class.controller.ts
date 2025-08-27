import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { Class } from "./class.model";

// Create Class
export const createClass = asyncHandler(async (req: Request, res: Response) => {
  const { className, section, teacher, subjects, students } = req.body;

  // Validate required fields
  if (!className || !section || !teacher) {
    return res.status(400).json({
      success: false,
      message: "Please provide * all required fields",
    });
  }

  // Create Class
  const newClass = await Class.create({
    className,
    section,
    teacher,
  });

  res.status(201).json({ success: true, data: newClass });
});

// Get all Classes
export const getAllClasses = asyncHandler(
  async (req: Request, res: Response) => {
    const { search } = req.query;
    const filter: any = {};
    if (search) {
      filter.class = { $regex: search, $options: "i" };
    }

    const classes = await Class.find(filter)
      .populate("teacher", "fullName ")
      .select("-password -refreshToken");
    res.status(200).json({ success: true, data: classes });
  }
);
