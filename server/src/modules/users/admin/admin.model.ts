import { compare } from "bcryptjs";
import { hash } from "bcryptjs";
import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

export interface IAdmin extends Document {
  _id: string;
  adminId: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  role: string;
  status: string;
  profilePicture: string;
  refreshToken: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>({
  adminId: {
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
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  refreshToken: {
    type: String,
    default: "",
  },
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

// compare password
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await compare(candidatePassword, this.password);
};

export const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
