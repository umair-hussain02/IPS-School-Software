import { Schema, model, Document, Types } from "mongoose";

export interface IActivity extends Document {
  title: string;
  task: string;
  guidelines: string;
  subjectId: Types.ObjectId;
}

const ActivitySchema = new Schema<IActivity>(
  {
    title: { type: String, required: true },
    task: { type: String, required: true },
    guidelines: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  },
  { timestamps: true }
);

export const Activity = model<IActivity>("Activity", ActivitySchema);
