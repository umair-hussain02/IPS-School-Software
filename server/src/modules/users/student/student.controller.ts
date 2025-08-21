import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { Student } from "./student.model";
import { generateAccessTokenAndRefreshToken } from "../../../utils/jwt";

export const loginStudent = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { studentId, password } = req.body;

      // Validate required fields
      if (!studentId || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide * all required fields",
        });
      }

      // Check if student exists
      const student = await Student.findOne({ studentId });
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      // Check password
      const isMatch = await student.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Password Incorrect...!",
        });
      }

      // Generate token
      const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(student);

      const loggedInStudent = await Student.findById(student._id).select(
        "-password -refreshToken"
      );

      res
        .cookie("RefreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
        })
        .cookie("AccessToken", accessToken, {
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .json({ success: true, data: loggedInStudent });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error when logging in student: ${error.message}`,
      });
    }
  }
);
