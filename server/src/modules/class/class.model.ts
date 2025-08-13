import { Document, model, Schema, Types } from "mongoose";

export interface IClass extends Document {
  name: string;
  section: string;
  teacher: Types.ObjectId;
  subjects: Types.ObjectId[];
  students: Types.ObjectId[];
}

const ClassSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const Class = model<IClass>("Class", ClassSchema);
