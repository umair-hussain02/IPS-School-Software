import { Model, Schema } from "mongoose";
import { compare, hash } from "bcryptjs";
import mongoose from "mongoose";

export interface IOther {
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

  documents: string[];
  salary: number;
}

const OtherSchema = new Schema<IOther>(
  {
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
      enum: ["admin", "student", "teacher", "other"],
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
    documents: {
      type: [String],
      default: [],
    },
    salary: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

OtherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

// compare password
OtherSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await compare(candidatePassword, this.password);
};

export const OtherUser: Model<IOther> =
  mongoose.models.User || mongoose.model<IOther>("User", OtherSchema);
