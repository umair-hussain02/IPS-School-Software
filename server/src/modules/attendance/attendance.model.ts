import { Document, model, Schema, Types } from "mongoose";

export interface IAttendance extends Document {
  userId: Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "late" | "excused";
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Attendance = model<IAttendance>("Attendance", AttendanceSchema);
