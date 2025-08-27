import { compare, hash } from "bcryptjs";
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ITeacher extends Document {
  _id: string;
  fullName: string;
  teacherId: string;
  phoneNumber: string;
  password: string;
  role: string;
  status: string;
  dob: string;
  gender: string;
  profilePicture: string;
  address: string;
  refreshToken: string;

  resume: string;
  otherDocuments: string[];
  qualification: string;
  specialization: [];
  experience: string;
  salary: number;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
    },
    teacherId: {
      type: String,
      required: [true, "Teacher ID is required"],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "student", "teacher", "other"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    dob: {
      type: String,
      // required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      // required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      // required: true,
    },
    refreshToken: {
      type: String,
      default: "",
    },
    resume: {
      type: String,
      // required: true,
    },
    otherDocuments: {
      type: [String],
      default: [],
    },
    qualification: {
      type: String,
      // required: true,
    },
    specialization: {
      type: [String],
      // required: true,
    },
    experience: {
      type: String,
      // required: true,
    },
    salary: {
      type: Number,
      // required: true,
    },
  },
  { timestamps: true }
);

// Password hash middleware
TeacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

// compare password
TeacherSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await compare(candidatePassword, this.password);
};

export const Teacher: Model<ITeacher> =
  mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema);
