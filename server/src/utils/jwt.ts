import jwt, { Secret, SignOptions } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: Secret =
  process.env.ACCESS_TOKEN_SECRET || "supersecret";
const REFRESH_TOKEN_SECRET: Secret =
  process.env.REFRESH_TOKEN_SECRET || "refreshsecret";

export interface TokenPayload {
  _id: string;
  role: "admin" | "student" | "teacher" | "other";
}

export const generateAccessToken = (payload: TokenPayload) => {
  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1h",
  };
  return jwt.sign(payload as object, ACCESS_TOKEN_SECRET, options);
};

export const generateRefreshToken = (payload: TokenPayload) => {
  const options = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  };
  return jwt.sign(payload as object, REFRESH_TOKEN_SECRET, options);
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return decoded as TokenPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return decoded as TokenPayload;
  } catch {
    return null;
  }
};
