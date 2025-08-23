import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Announcement } from "./announcement.model";

// ----------------  Create Announcement  ----------------

export const createAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        title,
        content,
        category,
        visibility,
        pinned,
        priority,
        expiresAt,
      } = req.body;
      const adminId = req.user?._id;
      const newAnnouncement = await Announcement.create({
        title,
        content,
        category,
        visibility,
        createdBy: adminId,
        pinned,
        priority,
        expiresAt,
      });

      res.status(201).json({
        success: true,
        data: newAnnouncement,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error in creating announcement ${error.message}`,
      });
    }
  }
);

//-----------------  Get All Announcement ----------------
export const getAllAnnouncements = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { category, role } = req.query;

      const filter: any = {};
      if (category) filter.category = category;
      if (role) filter.visibility = role;

      const announcements = await Announcement.find(filter)
        .sort({ createdAt: -1, pinned: -1 })
        .populate("createdBy", "fullName");

      res.status(200).json({
        success: true,
        data: announcements,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error in fetching announcements ${error.message}`,
      });
    }
  }
);

// ---------------- Update Announcement  -----------------

export const updateAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const announcement = await Announcement.findById(req.params.id);
      if (!announcement)
        return res.status(404).json({ message: "Announcement not Found" });

      if (
        req.user?.role !== "admin" &&
        req.user?._id !== String(announcement.createdBy)
      ) {
        return res.status(403).json({
          message: "You are not authorized to update this announcement",
        });
      }
      const updated = await Announcement.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error in updating announcement ${error.message}`,
      });
    }
  }
);

// ---------------- Deletele Announcement ----------------

export const deleteAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const announcement = await Announcement.findById(req.params.id);

      if (!announcement) {
        return res.status(404).json({
          success: false,
          message: "Announcement not found",
        });
      }
      if (
        req.user?.role !== "admin" &&
        req.user?._id !== String(announcement.createdBy)
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this announcement",
        });
      }
      await announcement.deleteOne();

      res.status(200).json({
        success: true,
        message: "Announcement deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error in deleting announcement ${error.message}`,
      });
    }
  }
);
