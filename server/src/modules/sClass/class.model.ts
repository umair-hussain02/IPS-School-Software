import { Document, model, Schema, Types } from "mongoose";

export interface IClass extends Document {
  className: string;
  section: string;
  teacher: Types.ObjectId;
  // students: [{ type: Schema.Types.ObjectId, ref: "Student" }]
}

const ClassSchema = new Schema<IClass>(
  {
    className: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  { timestamps: true }
);

export const Class = model<IClass>("Class", ClassSchema);
