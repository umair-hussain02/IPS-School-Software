import { z } from "zod";

import { Types } from "mongoose";

export const studentSchema = z.object({
  _id: z.string().min(1, "_id is required"),
  studentId: z.string().min(1, "studentId is required"),
  fullName: z.string().min(1, "fullName is required"),
  phoneNumber: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"), // adjust regex to your format
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "role is required"),
  status: z.string().min(1, "status is required"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "dob must be a valid date string",
  }),
  gender: z.enum(["male", "female", "other"]),
  profilePicture: z.string().url("Invalid profile picture URL").optional(),
  address: z.string().min(1, "address is required"),
  refreshToken: z.string().optional(),

  bForm: z.string().min(1, "bForm is required"),
  rollNo: z.string().min(1, "rollNo is required"),
  guardianRelation: z.string().min(1, "guardianRelation is required"),
  guardianFullName: z.string().min(1, "guardianFullName is required"),
  admissionDate: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "admissionDate must be a valid date",
    }),
  class: z.instanceof(Types.ObjectId).or(
    z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid ObjectId",
    })
  ),
});

export type Student = z.infer<typeof studentSchema>;
