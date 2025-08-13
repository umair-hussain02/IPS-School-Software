import { compare, hash } from "bcryptjs";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
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
}

const UserSchema = new Schema<IUser>(
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
  },
  {
    timestamps: true,
  }
);

// Password hash middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

// compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await compare(candidatePassword, this.password);
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
