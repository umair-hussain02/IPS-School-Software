import { Schema, Types } from "mongoose";
import { User } from "./user.model";

export interface IStudent {
  rollNo: string;
  guardianRelation: string;
  guardianFullName: string;
  admissionDate: Date;
  class: Types.ObjectId;
  subjects: Types.ObjectId[];
  attendance: Types.ObjectId;
}

const StudentSchema = new Schema<IStudent>({
  rollNo: {
    type: String,
    required: true,
  },
  guardianRelation: {
    type: String,
    required: true,
  },
  guardianFullName: {
    type: String,
    required: true,
  },
  admissionDate: {
    type: Date,
    required: true,
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subjects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  attendance: {
    type: Schema.Types.ObjectId,
    ref: "Attendance",
  },
});

export const Student = User.discriminator<IStudent>("student", StudentSchema);
