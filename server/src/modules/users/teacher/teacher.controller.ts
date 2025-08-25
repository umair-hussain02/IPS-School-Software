import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { Teacher } from "./teacher.model";
import { generateAccessTokenAndRefreshToken } from "../../../utils/jwt";

// ------------------   Login Teacher  ------------------
export const loginTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { teacherId, password } = req.body;

      // Validate required fields
      if (!teacherId || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide * all required fields",
        });
      }

      // Check if teacher exists
      const teacher = await Teacher.findOne({ teacherId });
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found",
        });
      }

      // Check password
      const isMatch = await teacher.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Password Incorrect...!",
        });
      }

      // Generate token
      const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(teacher);

      const loggedInTeacher = await Teacher.findById(teacher._id).select(
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
        .json({ success: true, data: loggedInTeacher });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error when logging in teacher: ${error.message}`,
      });
    }
  }
);
