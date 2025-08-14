import { Request, Response } from "express";
import { User } from "./user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import mongoose from "mongoose";
import { Student } from "./student.model";
import { Teacher } from "./teacher.model";
import { Other } from "./otherUser.model";
import { Class } from "../class/class.model";
import { Attendance } from "../attendance/attendance.model";

//=========================== Admin Related Controllers ========================

// get all user
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, role, search } = req.query;

  const filter: any = {};
  if (role) filter.role = role;
  if (search) {
    filter.fullName = { $regex: search as string, $options: "i" };
  }
  const skip = (Number(page) - 1) * Number(limit);

  const users = await User.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: users,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
    },
  });
});

// Get User by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }
  const user = User.findById(id).select("-password -refreshToken");

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User not found of this id" });
  }
  if (req.user?.role === "admin" && req.user?._id !== id) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied for admin users" });
  }
  res.json({ success: true, data: user });
});

// Register User
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        fullName,
        phoneNumber,
        password,
        role,
        dob,
        gender,
        address,
        ...rest
      } = req.body;
      const existingUser = await User.find({ phoneNumber });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      if (!role) {
        return res
          .status(400)
          .json({ success: false, message: "Role is required" });
      }
      let newUser;
      if (role === "student") {
        newUser = await Student.create({
          fullName,
          phoneNumber,
          password,
          dob,
          gender,
          address,
          ...rest,
        });
      } else if (role === "teacher") {
        newUser = await Teacher.create({
          fullName,
          phoneNumber,
          password,
          dob,
          gender,
          address,
          ...rest,
        });
      } else if (role === "other") {
        newUser = await Other.create({
          fullName,
          phoneNumber,
          password,
          dob,
          gender,
          address,
          ...rest,
        });
      } else {
        res.status(400);
        throw new Error("Invalid role");
      }

      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error registering user" });
    }
  }
);

// Update User info

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  if (req.user?.role === "admin" && req.user?._id !== id) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied for admin users" });
  }

  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

  if (!updatedUser) {
    return res
      .status(404)
      .json({ success: false, message: "User not found of this id" });
  }

  res.json({ success: true, data: updatedUser });
});

// Delete User
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const deleted = await User.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, message: "User deleted successfully" });
});

//=========================== Teacher Related Controllers ========================

// Get Assigned Classes
export const getAssignedClass = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const teacherId = req.user?._id;
      const classes = await Class.find({ teacher: teacherId }).populate(
        "subjects"
      );
      res.json({ success: true, data: classes });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error fetching assigned classes" });
    }
  }
);

// Get Class Students
export const getClassStudents = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const classId = req.params.id;
      const students = await Student.find({ class: classId }).populate(
        "attendance"
      );
      if (!students)
        return res.status(404).json({ message: "Class not found" });
      res.json({ success: true, data: students });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error fetching class students" });
    }
  }
);

// Mark Class Attendance   TODO: GO THROUGH AGAIN attendance marking logic
export const markClassAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { studentId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid class ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID" });
    }

    const attendance = await Attendance.create({
      class: classId,
      student: studentId,
      status,
    });

    res.status(201).json({ success: true, data: attendance });
  }
);

//=========================== Controller for Student ========================

// GET assigned class & subjects
export const getAssignedClassesAndSubjects = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const studentId = req.user?._id;
      const classes = await Class.find({ students: studentId }).populate(
        "subjects"
      );
      res.json({ success: true, data: classes });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error fetching class & subjects" });
    }
  }
);

// Get Attendance Record
export const getAttendanceRecord = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const studentId = req.user?._id;
      const attendance = await Attendance.find({ student: studentId })
        .populate("class")
        .populate("student");
      res.json({ success: true, data: attendance });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error fetching attendance record" });
    }
  }
);

//=========================== Controller for all User ========================

// Upload Avatar / profile picture
export const uploadProfilePicture = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePicture: `/uploads/avatars/${req.file.filename}` },
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: updatedUser });
  }
);
