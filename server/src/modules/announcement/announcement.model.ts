import { Schema, model, Document, Types } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  date: Date;
  subjectId: Types.ObjectId;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  },
  { timestamps: true }
);

export const Announcement = model<IAnnouncement>(
  "Announcement",
  AnnouncementSchema
);
