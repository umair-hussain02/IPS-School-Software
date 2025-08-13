import { z } from "zod";

const baseUserSchema = {
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["teacher", "student", "other"]),
  status: z.enum(["active", "inactive"]).default("active"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  profilePhoto: z.string().url().optional(),
  address: z.string().optional(),
  refreshToken: z.string().default(""),
};

export const teacherSchema = z.object({
  ...baseUserSchema,
  resume: z.string().url().optional(),
  otherDocuments: z.array(z.string().url()).optional(),
  qualification: z.string(),
  specializedSubject: z.string(),
  experience: z.string(),
  salary: z.number(),
  classId: z.string(),
  subjects: z.array(z.string()),
  attendance: z.string().optional(),
});
//
export const studentSchema = z.object({
  ...baseUserSchema,
  rollNo: z.string(),
  guardianRelation: z.string(),
  guardianFullName: z.string(),
  admissionDate: z.string(),
  classId: z.string(),
  subjects: z.array(z.string()),
  attendance: z.string().optional(),
});

// Other role fields
export const otherRoleSchema = z.object({
  ...baseUserSchema,
  documents: z.array(z.string().url()).optional(),
  salary: z.number().optional(),
});

export type TeacherInputs = z.infer<typeof teacherSchema>;
export type StudentInputs = z.infer<typeof studentSchema>;
export type OtherRoleInputs = z.infer<typeof otherRoleSchema>;
