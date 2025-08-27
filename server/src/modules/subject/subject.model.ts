import { model, Schema, Types } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  classId: Types.ObjectId;
  teacherId: Types.ObjectId;
  topicCovered: string;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topicCovered: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Subject = model<ISubject>("Subject", SubjectSchema);
