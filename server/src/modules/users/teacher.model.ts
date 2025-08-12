import { Schema, Types } from "mongoose";
import { User } from "./user.model";

export interface ITeacher {
  resume: string;
  otherDocuments: string[];
  qualification: string;
  specialization: string;
  experience: string;
  salary: number;
  class: Types.ObjectId;
  subjects: Types.ObjectId[];
  attendance: Types.ObjectId;
}

const TeacherSchema = new Schema<ITeacher>({
  resume: {
    type: String,
    required: true,
  },
  otherDocuments: {
    type: [String],
    default: [],
  },
  qualification: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
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

export const Teacher = User.discriminator<ITeacher>("teacher", TeacherSchema);
