import { Document, model, Schema, Types } from "mongoose";

export interface IPeriod {
  subject: Types.ObjectId;
  teacher: Types.ObjectId;
  startTime: string;
  endTime: string;
}

export interface ITimetable extends Document {
  classId: Types.ObjectId;
  periods: IPeriod[];
  day: string;
}

const PeriodSchema = new Schema<IPeriod>(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const TimetableSchema = new Schema<ITimetable>(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    periods: {
      type: [PeriodSchema],
      validate: [
        (val: IPeriod[]) => val.length === 8,
        "Timetable must have exactly 8 periods",
      ],
    },
  },
  { timestamps: true }
);

export const Timetable = model<ITimetable>("Timetable", TimetableSchema);
