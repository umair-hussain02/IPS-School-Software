import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler";
import { Teacher } from "../users/teacher/teacher.model";
import {
  AttendanceStatus,
  StudentAttendance,
  TeacherAttendance,
} from "./attendance.model";
import { Request, Response } from "express";
import { Class } from "../sClass/class.model";
import { Student } from "../users/student/student.model";

// Mark student attendance
export const markStudentAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const { date, records } = req.body;

    const teacherId = req.user?._id;
    const role = req.user?.role;
    // Check if the user is a class teacher

    const classId = await Class.findOne({ teacher: teacherId }).select("_id");

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

// Get Student Attendance
export const getStudentAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { date, classId, section, status, search } = req.query;
      const filter: any = {};

      if (classId && mongoose.Types.ObjectId.isValid(classId as string)) {
        filter.classId = classId;
      }

      if (date) {
        filter.date = date;
      }

      if (section) {
        filter.section = section;
      }

      if (status) {
        filter.status = status;
      }

      if (search) {
        filter.$or = [
          { studentId: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
        ];
      }

      const attendanceRecords = await StudentAttendance.find(filter)
        .populate("student", "fullName studentId")
        .populate("class", "className section");

      const totalStudent = await Student.countDocuments({ status: "active" });
      const totalPresent = attendanceRecords.filter(
        (r) => r.status === "present"
      ).length;
      const totalAbsent = attendanceRecords.filter(
        (r) => r.status === "absent"
      ).length;
      const totalLate = attendanceRecords.filter(
        (r) => r.status === "late"
      ).length;
      const totalExcused = attendanceRecords.filter(
        (r) => r.status === "excused"
      ).length;

      res.status(200).json({
        data: attendanceRecords,
        summary: {
          totalStudent,
          totalPresent,
          totalAbsent,
          totalLate,
          totalExcused,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching attendance records", error });
    }
  }
);
