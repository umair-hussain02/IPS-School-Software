import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { IResult, Result } from "./grade.model";

const letterGradeCalculator = (percentage: number) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "F";
};
// ---------------   Create Result -----------------
export const createResult = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        studentId,
        subjectId,
        classId,
        examType,
        score,
        totalMarks,
        remarks,
      } = req.body;

      const percentage = (score / totalMarks) * 100;

      const letterGrade = letterGradeCalculator(percentage);

      const result = await Result.create({
        studentId,
        subjectId,
        teacherId: req.user?._id,
        classId,
        examType,
        score,
        totalMarks,
        percentage,
        letterGrade,
        remarks,
      });

      res.status(201).json(result);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error while creating Result: ${error.message}` });
    }
  }
);

// ---------------   Get Result -----------------

export const getResult = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studentId, subjectId, classId } = req.query;
    const filter: any = {};

    if (studentId) filter.studentId = studentId;
    if (subjectId) filter.subjectId = subjectId;
    if (classId) filter.classId = classId;

    const results = await Result.find(filter)
      .populate("studentId", "name rollNo")
      .populate("subjectId", "name")
      .populate("teacherId", "fullName")
      .populate("classId", "name section");

    res.status(200).json(results);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error While fetching results: ${error.message}` });
  }
});

// ---------------   Update Result  -----------------

export const updateResult = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const result = await Result.findById(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Result Not found.." });
      }

      if (
        req.user?.role !== "admin" &&
        req.user?._id !== String(result.teacherId)
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { score, totalMarks, remarks } = req.body;
      if (score && totalMarks) {
        result.score = score;
        result.totalMarks = totalMarks;
        result.percentage = (score / totalMarks) * 100;
        result.letterGrade = letterGradeCalculator(result.percentage);
      }
      if (remarks) result.remarks = remarks;

      await result.save();

      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error While updating result: ${error.message}` });
    }
  }
);

// ---------------   Delete Result  -----------------

export const deleteResult = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const result = await Result.findById(req.params.id);
      if (!result) return res.status(404).json({ message: "Not found" });

      if (
        req.user?.role !== "admin" &&
        req.user?._id !== String(result.teacherId)
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await result.deleteOne();

      res.status(204).json(result);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error While deleting result: ${error.message}` });
    }
  }
);
