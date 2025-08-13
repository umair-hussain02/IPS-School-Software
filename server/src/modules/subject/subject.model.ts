import { model, Schema, Types } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  classId: Types.ObjectId;
  teacherId: Types.ObjectId;
  studyMaterial: Types.ObjectId[];
  announcements: Types.ObjectId[];
  assignments: Types.ObjectId[];
  quizzes: Types.ObjectId[];
  activities: Types.ObjectId[];
  discussions: Types.ObjectId[];
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
    studyMaterial: [
      {
        type: Schema.Types.ObjectId,
        ref: "StudyMaterial",
      },
    ],
    announcements: [
      {
        type: Schema.Types.ObjectId,
        ref: "Announcement",
      },
    ],
    assignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
    quizzes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    discussions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Discussion",
      },
    ],
  },
  { timestamps: true }
);

export const Subject = model<ISubject>("Subject", SubjectSchema);
