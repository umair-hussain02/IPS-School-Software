import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { Teacher } from "../teacher/teacher.model";
import { uploadOnCloudinary } from "../../../utils/cloudinary";
import generateUniqueId from "../../../utils/generateUniqueId";
import { Student } from "../student/student.model";
import { Admin } from "./admin.model";
import { Class } from "../../class/class.model";
import { Subject } from "../../subject/subject.model";
import { generateAccessTokenAndRefreshToken } from "../../../utils/jwt";

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

// Create Class
export const createClass = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { className, section, teacher, subjects, students } = req.body;

    // Validate required fields
    if (!className || !section || !teacher || !subjects || !students) {
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
      subjects,
      students,
    });

    res.status(201).json({ success: true, data: newClass });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Error when creating class: ${error.message}`,
    });
  }
});

// Create Subject
export const createSubject = asyncHandler(
  async (req: Request, res: Response) => {
    try {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error when creating subject: ${error.message}`,
      });
    }
  }
);

// Login Admin

export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { adminId, password } = req.body;

    // Validate required fields
    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide * all required fields",
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password Incorrect...!",
      });
    }

    // Generate token
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(admin);

    const loggedInAdmin = await Admin.findById(admin._id).select(
      "-password -refreshToken"
    );

    res
      .cookie("Refresh Token", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("Access Token", accessToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({ success: true, data: loggedInAdmin });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Error when logging in admin: ${error.message}`,
    });
  }
});

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
