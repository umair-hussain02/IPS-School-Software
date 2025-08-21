import { model, Schema, Types } from "mongoose";

const QuizSubmissionSchema = new Schema(
  {
    quiz: {
      type: Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    student: {
      type: Types.ObjectId,
      ref: "Student",
      required: true,
    },
    answer: [
      {
        questionId: {
          type: Types.ObjectId,
          required: true,
        },
        selectedOptions: [
          {
            type: Types.ObjectId,
          },
        ],
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

QuizSubmissionSchema.index({ quiz: 1, student: 1 }, { unique: true });

export const QuizSubmission = model("QuizSubmission", QuizSubmissionSchema);
