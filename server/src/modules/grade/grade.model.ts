import { Document, model, Schema, Types } from "mongoose";

export interface IResult extends Document {
  studentId: Types.ObjectId;
  subjectId: Types.ObjectId;
  teacherId: Types.ObjectId;
  classId: Types.ObjectId;

  examType: string;
  score: number;
  totalMarks: number;
  percentage: number;
  letterGrade: string;
  remarks?: string;
  date: Date;
}

const ResultSchema = new Schema<IResult>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    examType: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    letterGrade: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
    },

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Result = model<IResult>("Result", ResultSchema);
