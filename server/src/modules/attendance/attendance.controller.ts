import { asyncHandler } from "../../utils/asyncHandler";
import { Teacher } from "../users/teacher/teacher.model";
import {
  AttendanceStatus,
  StudentAttendance,
  TeacherAttendance,
} from "./attendance.model";
import { Request, Response } from "express";

// Mark student attendance
export const markStudentAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { studentId, date, records, remarks } = req.body;

      const teacherId = req.user?._id;
      const role = req.user?.role;
      // Check if the user is a class teacher

      const classId = await Teacher.findById(teacherId).select("classId");

      if (!classId) {
        return res.status(404).json({ message: "Class not found" });
      }

      if (role !== "teacher") {
        return res.status(403).json({
          message: "Forbidden! Only Class Teachers can mark attendance.",
        });
      }
      if (!classId || !date || !records) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      const saveRecords = [];
      for (const record of records) {
        const { studentId, status, remarks } = record;

        if (!Object.values(AttendanceStatus).includes(status)) {
          continue;
        }

        const attendance = await StudentAttendance.findOneAndUpdate(
          { student: studentId, class: classId, date },
          {
            student: studentId,
            class: classId,
            date,
            status,
            markedBy: teacherId,
            remarks,
          },
          { upsert: true, new: true }
        );

        saveRecords.push(attendance);
      }

      res
        .status(200)
        .json({ message: "Attendance marked successfully", data: saveRecords });
    } catch (error) {
      res.status(500).json({ message: "Error marking attendance", error });
    }
  }
);

// Mark teacher attendance
export const markTeacherAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { date, adminId, records } = req.body;
      const admin = req.user;
      const role = admin?.role;
      if (role !== "admin") {
        return res.status(403).json({
          message: "Forbidden! Only Admins can mark teacher attendance.",
        });
      }
      if (!date || !records) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      const saveRecords = [];
      for (const rec of records) {
        const { teacherId, status, remarks } = rec;
        if (!Object.values(AttendanceStatus).includes(status)) {
          continue;
        }
        const attendance = await TeacherAttendance.findOneAndUpdate(
          { teacher: teacherId, date },
          {
            teacher: teacherId,
            date,
            status,
            markedBy: adminId,
            remarks,
          },
          { upsert: true, new: true }
        );
        saveRecords.push(attendance);
      }
      res
        .status(200)
        .json({ message: "Attendance marked successfully", data: saveRecords });
    } catch (error) {
      res.status(500).json({ message: "Error marking attendance", error });
    }
  }
);

/* Sample Data for student

{
  "classId": "64b2a5e4f0a7f4d9c3e23b10",
  "date": "2025-08-21",
  "records": [
    { "studentId": "64b2b0c8f0a7f4d9c3e23c99", "status": "present" },
    { "studentId": "64b2b0d5f0a7f4d9c3e23ca1", "status": "absent" },
    { "studentId": "64b2b0e0f0a7f4d9c3e23cb3", "status": "late" }
  ]
}


sample data for teacher

{
  "date": "2025-08-21",
  "records": [
    { "teacherId": "64b2b0c8f0a7f4d9c3e23c99", "status": "present" },
    { "teacherId": "64b2b0d5f0a7f4d9c3e23ca1", "status": "absent" },
    { "teacherId": "64b2b0e0f0a7f4d9c3e23cb3", "status": "late" }
  ]
}

*/
