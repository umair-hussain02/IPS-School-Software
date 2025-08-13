import { Schema, model, Document, Types } from "mongoose";

export interface IStudyMaterial extends Document {
  title: string;
  downloadLink: string;
  fileSize: string; // e.g., "10MB"
  uploadTime: Date;
  subjectId: Types.ObjectId;
}

const StudyMaterialSchema = new Schema<IStudyMaterial>(
  {
    title: { type: String, required: true },
    downloadLink: { type: String, required: true },
    fileSize: { type: String, required: true },
    uploadTime: { type: Date, default: Date.now },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  },
  { timestamps: true }
);

export const StudyMaterial = model<IStudyMaterial>(
  "StudyMaterial",
  StudyMaterialSchema
);
