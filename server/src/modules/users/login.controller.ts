import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Admin } from "./admin/admin.model";
import { Teacher } from "./teacher/teacher.model";
import { Student } from "./student/student.model";
import { generateAccessTokenAndRefreshToken } from "../../utils/jwt";
import { Document } from "mongoose";

export const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id, password } = req.body;

    // Validate required fields
    if (!id || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    let user:
      | (Document & { comparePassword: (pw: string) => Promise<boolean> })
      | null = null;
    let role: "admin" | "teacher" | "student" | null = null;

    // Try to find user in Admin, Teacher, Student collections
    if (!user) {
      user = await Admin.findOne({ adminId: id });
      if (user) role = "admin";
    }
    if (!user) {
      user = await Teacher.findOne({ teacherId: id });
      if (user) role = "teacher";
    }
    if (!user) {
      user = await Student.findOne({ studentId: id });
      if (user) role = "student";
    }

    if (!user || !role) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user);

    // Exclude sensitive fields
    const safeUser =
      role === "admin"
        ? await Admin.findById(user._id).select("-password -refreshToken")
        : role === "teacher"
        ? await Teacher.findById(user._id).select("-password -refreshToken")
        : await Student.findById(user._id).select("-password -refreshToken");

    // Send response
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
      .json({
        success: true,
        data: safeUser,
        role,
        accessToken,
        refreshToken,
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Error when logging in user: ${error.message}`,
    });
  }
});
