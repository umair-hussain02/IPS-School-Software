import { Schema } from "mongoose";
import { User } from "./user.model";

export interface IOther {
  documents: string[];
  salary: number;
}

const OtherSchema = new Schema<IOther>({
  documents: {
    type: [String],
    default: [],
  },
  salary: {
    type: Number,
    required: true,
  },
});

export const Other = User.discriminator<IOther>("other", OtherSchema);
