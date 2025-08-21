import { model, Schema, Types } from "mongoose";

export interface IOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion {
  text: string;
  options: IOption[];
}

const OptionSchema = new Schema<IOption>(
  {
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const QuestionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    options: { type: [OptionSchema], required: true },
  },
  { _id: false }
);

const QuizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    // setting

    shuffleQuestion: {
      type: Boolean,
      default: false,
    },
    showResultImmediately: {
      type: Boolean,
      default: false,
    },
    allowReviews: {
      type: Boolean,
      default: false,
    },

    // questions

    questions: {
      type: [QuestionSchema],
      default: [],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    class: {
      type: Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subject: {
      type: Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  },
  { timestamps: true }
);

export const Quiz = model("Quiz", QuizSchema);
