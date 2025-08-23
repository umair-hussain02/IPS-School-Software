import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { IQuestion, Quiz } from "./quiz.model";
import { QuizSubmission } from "./quizSubmission.model";

// --------------------  Create Quiz   -----------------------

export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      questions,
      shuffleQuestion,
      showResultImmediately,
      allowReviews,
      createdBy,
      class: classId,
      subject,
    } = req.body;

    const teacherId = req.user?._id;
    if (!teacherId) {
      return res
        .status(401)
        .json({ message: "Unauthorized Request for Quiz Creation" });
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      shuffleQuestion,
      showResultImmediately,
      allowReviews,
      createdBy: teacherId,
      class: classId,
      subject,
    });

    res
      .status(201)
      .json({ success: true, message: "Quiz Created Successfully", quiz });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Error while creating quiz: ${error.message}`,
    });
  }
});

// -------------------   Get Quiz --------------------

export const getQuiz = asyncHandler(async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    if (quiz.shuffleQuestion) {
      quiz.questions = quiz.questions.sort(() => Math.random() - 0.5);
    }

    (quiz.questions as any) = quiz.questions.map((q: any) => {
      return {
        ...q,
        options: q.options.map(({ text }: any) => ({ text })), // Ensure options are returned with only text
      };
    });

    res.status(200).json({ success: true, quiz });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Error while fetching quiz: ${error.message}`,
    });
  }
});

// ------------------- Submit Quiz -------------------

export const submitQuiz = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { quizId, answers } = req.body;
    const studentId = req.user?._id;

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
    let score = 0;

    for (const ans of answers) {
      const q = quiz.questions.find(
        (q: any) => q._id.toString() === ans.questionId
      );
      if (!q) continue;

      const correctOptions = q.options
        .filter((option: any) => option.isCorrect)
        .map((option: any) => option._id.toString());

      const selectedOptions = ans.selectedOptionsIds.map((id: any) =>
        id.toString()
      );
      if (
        JSON.stringify(selectedOptions.sort()) ===
        JSON.stringify(correctOptions.sort())
      ) {
        score++;
      }
    }

    const percentage = (score / quiz.questions.length) * 100;

    const submission = await QuizSubmission.create({
      quiz: quizId,
      student: studentId,
      score,
      percentage,
    });

    res.status(200).json({ success: true, submission });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Error while submitting quiz: ${error.message}`,
    });
  }
});
