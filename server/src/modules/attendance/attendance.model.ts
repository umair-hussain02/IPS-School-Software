import { Schema, model, Types, Document } from "mongoose";

export interface IAttendance extends Document {
  user: Types.ObjectId; // student or teacher ID (from User model)
  date: Date;
  status: "present" | "absent" | "leave" | "late";
  remarks?: string;
  markedBy: Types.ObjectId; // who marked the attendance (teacher/admin)
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "leave", "late"],
      required: true,
    },
    remarks: {
      type: String,
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // teacher/admin ID
    },
  },
  {
    timestamps: true,
  }
);

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });
// Prevent duplicate attendance for the same user on the same date

export const Attendance = model<IAttendance>("Attendance", AttendanceSchema);
