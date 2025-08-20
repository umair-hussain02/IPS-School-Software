import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { Teacher } from "../teacher/teacher.model";
import { uploadOnCloudinary } from "../../../utils/cloudinary";

interface MulterRequest extends Request {
  files: any;
}

// Create Teacher
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
          .json({ success: false, message: "User already exists" });
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
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

// Create Student
export const registerStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      fullName,
      phoneNumber,
      password,
      role = "student",
      status,
      ...rest
    } = req.body;
  }
);

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
