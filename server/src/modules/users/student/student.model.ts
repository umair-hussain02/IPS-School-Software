import { compare, hash } from "bcryptjs";
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IStudent extends Document {
  studentId: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  role: string;
  status: string;
  dob: string;
  gender: string;
  profilePicture: string;
  address: string;
  refreshToken: string;

  bForm: string;
  rollNo: string;
  guardianRelation: string;
  guardianFullName: string;
  admissionDate: Date;
  class: Types.ObjectId;
  subjects: Types.ObjectId[];
  attendance: Types.ObjectId;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const StudentSchema = new Schema<IStudent>(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "Username is required"],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: "",
    },

    bForm: {
      type: String,
      // required: true,
    },
    rollNo: {
      type: String,
      required: true,
    },
    guardianRelation: {
      type: String,
      required: true,
    },
    guardianFullName: {
      type: String,
      required: true,
    },
    admissionDate: {
      type: Date,
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    attendance: {
      type: Schema.Types.ObjectId,
      ref: "Attendance",
    },
  },
  {
    timestamps: true,
  }
);

// Password hash middleware
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

// compare password
StudentSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await compare(candidatePassword, this.password);
};

export const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);
