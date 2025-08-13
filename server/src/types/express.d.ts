import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      _id: string;
      role: "admin" | "student" | "teacher" | "other";
      fullName: string;
      phoneNumber: string;
    };
  }
}
