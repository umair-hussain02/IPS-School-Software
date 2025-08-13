import { Schema, model, Document, Types } from "mongoose";

interface IAnswer {
  submissionDate: Date;
  submissionTime: string; // Optional, or combine into Date
  fileUrl?: string; // Optional link to submitted work
}

export interface IAssignment extends Document {
  title: string;
  task: string;
  dueDate: Date;
  totalMark: number;
  answers: {
    studentId: Types.ObjectId; // Reference to student
    answer: IAnswer;
    score?: number;
    remark?: string;
  }[];
  subjectId: Types.ObjectId;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    task: { type: String, required: true },
    dueDate: { type: Date, required: true },
    totalMark: { type: Number, required: true },
    answers: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        answer: {
          submissionDate: { type: Date },
          submissionTime: { type: String },
          fileUrl: { type: String },
        },
        score: { type: Number },
        remark: { type: String },
      },
    ],
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  },
  { timestamps: true }
);

export const Assignment = model<IAssignment>("Assignment", AssignmentSchema);
