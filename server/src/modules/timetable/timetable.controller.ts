import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Timetable } from "./timetable.model";

// -------------  Create Timetable ------------

export const createTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const timetable = new Timetable(req.body);
      await timetable.save();
      res.status(201).json(timetable);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error While creating timetable. ${error.message}` });
    }
  }
);

// -------------  Get Timetable ------------
export const getTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { classId, day } = req.query;
      const timetable = await Timetable.findOne({ classId, day })
        .populate("classId", "name")
        .populate("periods.subject", "name")
        .populate("periods.teacher", "name");

      if (!timetable) return res.status(400).json("Timetable not found");

      res.status(200).json(timetable);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error While fetching timetable. ${error.message}` });
    }
  }
);

// --------------- Update Timetable ---------------

export const updateTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const timetable = await Timetable.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!timetable) return res.status(404).json("Timetable not found");
      res.status(200).json(timetable);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error While updating timetable. ${error.message}` });
    }
  }
);

// --------------  Delete Timetable ---------------

export const deleteTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const timetable = await Timetable.findByIdAndDelete(id);
      if (!timetable) return res.status(404).json("Timetable not found");
      res.status(200).json({ message: "Timetable deleted successfully" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error While deleting timetable. ${error.message}` });
    }
  }
);

// =========================   Period level Operations  =======================

// ------------  Add Period ------------
export const addPeriod = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { subject, teacher, startTime, endTime } = req.body;

    const timetable = await Timetable.findByIdAndUpdate(
      id,
      { $push: { periods: { subject, teacher, startTime, endTime } } },
      { new: true }
    );

    if (!timetable) return res.status(404).json("Timetable not found");

    res.status(201).json(timetable);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error While adding period ${error.message}` });
  }
});

// -----------   update perdiod ------------

export const updatePeriod = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id, periodId } = req.params;
      const { subject, teacher, startTime, endTime } = req.body;

      const timetable = await Timetable.findOneAndUpdate(
        { _id: id, "periods._id": periodId },
        {
          $set: {
            "periods.$.subject": subject,
            "periods.$.teacher": teacher,
            "periods.$.startTime": startTime,
            "periods.$.endTime": endTime,
          },
        },
        { new: true }
      );

      if (!timetable)
        return res.status(404).json("Timetable or period not found");

      res.status(200).json(timetable);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error While updating period ${error.message}` });
    }
  }
);

// ---------------- Delete Period  -----------------

export const deletePeriod = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id, periodId } = req.params;

      const timetable = await Timetable.findOneAndUpdate(
        { _id: id },
        { $pull: { periods: { _id: periodId } } },
        { new: true }
      );

      if (!timetable)
        return res.status(404).json("Timetable or period not found");

      res.status(200).json(timetable);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error While deleting period ${error.message}` });
    }
  }
);
