import { Schema, model, Types, Document } from "mongoose";

export enum AttendanceStatus {
  PRESENT = "present",
  LATE = "late",
  ABSENT = "absent",
  EXCUSED = "excused",
}

// ------------------------------Student Model---------------------------

export interface IAttendance extends Document {
  student: Types.ObjectId; // student or teacher ID (from User model)
  class: Types.ObjectId; // class ID (from Class model)

  date: Date;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: Types.ObjectId; // who marked the attendance (teacher/admin)
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: true,
    },
    remarks: {
      type: String,
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "Teacher", // teacher/admin ID
    },
  },
  {
    timestamps: true,
  }
);

AttendanceSchema.index({ student: 1, class: 1, date: 1 }, { unique: true });

// Prevent duplicate attendance for the same user on the same date

export const StudentAttendance = model<IAttendance>(
  "Attendance",
  AttendanceSchema
);

// ------------------------------Teacher Model---------------------------

const teacherAttendanceSchema = new Schema(
  {
    teacher: {
      type: Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: true,
    },
    markedBy: {
      type: Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate entry for same teacher/date
teacherAttendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });

export const TeacherAttendance = model(
  "TeacherAttendance",
  teacherAttendanceSchema
);
