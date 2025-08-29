// validationSchema.ts
import { z } from "zod";

export const studentFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .max(100, "Full Name must be under 100 characters"),

  phoneNumber: z
    .string()
    .min(10, "Phone Number must be at least 10 digits")
    .max(15, "Phone Number must be less than 15 digits")
    .regex(/^[0-9]+$/, "Phone Number must contain only digits"),

  dob: z
    .string()
    .min(1, "Date of Birth is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid Date of Birth",
    }),

  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required",
  }),

  profilePicture: z
    .any()
    .refine((file) => file?.length > 0, "Profile Image is required")
    .refine(
      (file) => !file || ["image/jpeg", "image/png"].includes(file?.[0]?.type),
      "Only .jpg or .png files are accepted"
    ),

  address: z.string().min(1, "Address is required"),

  guardianName: z.string().min(1, "Guardian Name is required"),

  guardianRelation: z.string().min(1, "Guardian Relation is required"),

  className: z.string().min(1, "Class is required"),

  rollNumber: z.string().min(1, "Roll Number is required"),
});

export type StudentFormSchema = z.infer<typeof studentFormSchema>;
