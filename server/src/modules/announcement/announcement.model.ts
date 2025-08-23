import { Schema, model, Document, Types } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  category:
    | "announcement"
    | "achievement"
    | "event"
    | "academic"
    | "cultural"
    | "sports";
  visibility: ("all" | "student" | "teacher")[];
  createdBy: Types.ObjectId;
  pinned: boolean;
  priority: "low" | "medium" | "high";
  expiresAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "announcement",
        "achievement",
        "event",
        "academic",
        "cultural",
        "sports",
      ],
      required: true,
    },
    visibility: [
      {
        type: String,
        enum: ["all", "student", "teacher"],
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    expiresAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export const Announcement = model<IAnnouncement>(
  "Announcement",
  AnnouncementSchema
);
