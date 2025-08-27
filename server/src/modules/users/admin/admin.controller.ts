import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { Teacher } from "../teacher/teacher.model";
import { uploadOnCloudinary } from "../../../utils/cloudinary";
import generateUniqueId from "../../../utils/generateUniqueId";
import { Student } from "../student/student.model";
import { Admin } from "./admin.model";
import mongoose from "mongoose";

interface MulterRequest extends Request {
  files: any;
}
// Create Admin
export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { fullName, password, phoneNumber, ...rest } = req.body;
    // Validate request body
    if (!fullName || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide * all required fields",
      });
    }

    // Upload profilePicture
    let profileImagePath;
    if (
      (req as MulterRequest).files &&
      Array.isArray((req as MulterRequest).files.profilePicture) &&
      (req as MulterRequest).files.profilePicture.length > 0
    ) {
      profileImagePath = (req as MulterRequest).files.profilePicture[0].path;
    }
    const profilePictureLink = await uploadOnCloudinary(profileImagePath);

    // Generate Unique Id
    let adminId: string = "";
    let exists = true;
    while (exists) {
      adminId = generateUniqueId("admin");
      exists = !!(await Admin.findOne({ adminId }));
    }

    // Save to Database
    const admin = await Admin.create({
      adminId,
      fullName,
      phoneNumber,
      password,
      profilePicture: profilePictureLink?.url,
      ...rest,
    });

    res.status(201).json({
      success: true,
      data: admin,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Error when creating admin: ${error.message}`,
    });
  }
});

// Create Teacher   - Assigning Unique Id is remaining
export const registerTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        fullName,
        phoneNumber,
        password,
        role = "teacher",
        status,
        profilePicture,
        resume,
        otherDocuments,
        ...rest
      } = req.body;

      // Generate Teacher Id
      let teacherId: string = "";
      let exists = true;

      while (exists) {
        teacherId = generateUniqueId("teacher");
        exists = !!(await Teacher.findOne({ teacherId }));
      }

      if (!fullName || !phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide * all required fields",
        });
      }

      const existingTeacher = await Teacher.findOne({ phoneNumber });
      if (existingTeacher) {
        return res
          .status(400)
          .json({ success: false, message: "Teacher already exists" });
      }

      let profileImagePath;

      if (
        (req as MulterRequest).files &&
        Array.isArray((req as MulterRequest).files.profilePicture) &&
        (req as MulterRequest).files.profilePicture.length > 0
      ) {
        profileImagePath = (req as MulterRequest).files.profilePicture[0].path;
      }

      let resumePath;

      if (
        (req as MulterRequest).files &&
        Array.isArray((req as MulterRequest).files.resume) &&
        (req as MulterRequest).files.resume.length > 0
      ) {
        resumePath = (req as MulterRequest).files.resume[0].path;
      }
      let otherDocumentsPaths = [];
      if (
        (req as MulterRequest).files &&
        Array.isArray((req as MulterRequest).files.otherDocuments) &&
        (req as MulterRequest).files.otherDocuments.length > 0
      ) {
        otherDocumentsPaths = (req as MulterRequest).files.otherDocuments.map(
          (file: Express.Multer.File) => file.path
        );
      }

      const profilePictureLink = await uploadOnCloudinary(profileImagePath);
      const resumeLink = await uploadOnCloudinary(resumePath);
      const otherDocumentsLinks = await Promise.all(
        otherDocumentsPaths.map((path: string) => uploadOnCloudinary(path))
      );

      const teacher = await Teacher.create({
        fullName,
        teacherId,
        phoneNumber,
        password,
        role,
        status,
        profilePicture: profilePictureLink?.url,
        resume: resumeLink?.url,
        otherDocuments: otherDocumentsLinks.map((link) => link?.url),
        ...rest,
      });

      const createdTeacher = await Teacher.findById(teacher._id).select(
        "-password -refreshToken"
      );
      res.status(201).json({ success: true, data: createdTeacher });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error when creating teacher: ${error.message}`,
      });
    }
  }
);

// Create Student
export const registerStudent = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        fullName,
        phoneNumber,
        password,
        profilePicture,
        bForm,
        rollNo,
        ...rest
      } = req.body;

      // generate unique Id
      let studentId: string = "";
      let exists = true;

      while (exists) {
        studentId = generateUniqueId("student");
        exists = !!(await Student.findOne({ studentId }));
      }

      // Validate required fields
      if (!fullName || !phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide * all required fields",
        });
      }

      // Documents Uploading on cloudinary
      let profileImagePath;

      if (
        (req as MulterRequest).files &&
        Array.isArray((req as MulterRequest).files.profilePicture) &&
        (req as MulterRequest).files.profilePicture.length > 0
      ) {
        profileImagePath = (req as MulterRequest).files.profilePicture[0].path;
      }

      let bFormPath;

      if (
        (req as MulterRequest).files &&
        Array.isArray((req as MulterRequest).files.bForm) &&
        (req as MulterRequest).files.bForm.length > 0
      ) {
        bFormPath = (req as MulterRequest).files.bForm[0].path;
      }

      const profilePictureLink = await uploadOnCloudinary(profileImagePath);
      const bFormLink = await uploadOnCloudinary(bFormPath);

      // Save to Database
      const student = await Student.create({
        fullName,
        phoneNumber,
        studentId,
        password,
        profilePicture: profilePictureLink?.url,
        bForm: bFormLink?.url,
        rollNo,
        ...rest,
      });

      res.status(201).json({ success: true, data: student });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Server Error when creating student: ${error.message}`,
      });
    }
  }
);

// Get all students

export const getAllStudents = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { search, classId, status } = req.query;

      const filter: any = {};
      if (classId && mongoose.Types.ObjectId.isValid(classId as string)) {
        filter.classId = classId;
      }
      if (status && ["active", "inactive"].includes(status as string)) {
        filter.status = status;
      }
      if (search) {
        const regex = new RegExp(search as string, "i");
        filter.$or = [
          { fullName: regex },
          { studentId: regex },
          { rollNo: regex },
          { phoneNumber: regex },
        ];
      }

      const students = await Student.find(filter)
        .populate("class", "name section")
        .select("-password -refreshToken") // never return sensitive fields
        .lean();

      res.status(200).json({
        success: true,
        data: students,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error when fetching students: ${error.message}`,
      });
    }
  }
);

// Get All Teachers
export const getAllTeachers = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { search, teacherId, status } = req.query;

      const filter: any = {};
      if (teacherId && mongoose.Types.ObjectId.isValid(teacherId as string)) {
        filter.teacherId = teacherId;
      }
      if (status && ["active", "inactive"].includes(status as string)) {
        filter.status = status;
      }
      if (search) {
        const regex = new RegExp(search as string, "i");
        filter.$or = [
          { fullName: regex },
          { teacherId: regex },
          { phoneNumber: regex },
        ];
      }

      const teachers = await Teacher.find(filter)
        .select("-password -refreshToken") // never return sensitive fields
        .lean();

      res.status(200).json({
        success: true,
        data: teachers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error when fetching teachers: ${error.message}`,
      });
    }
  }
);

// Login Admin

// upload student / teacher / staff data by CSV/ excel

// Get Fee Report

//

// Get All Teacher / Student / staff

// Get User by ID

// Update User Info

// Delete User

// Result Report

// Attendance Report

// Add Announcement (to staff / Teacher)
