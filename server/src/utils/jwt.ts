import jwt, { Secret, SignOptions } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: Secret =
  process.env.ACCESS_TOKEN_SECRET || "supersecret";
const REFRESH_TOKEN_SECRET: Secret =
  process.env.REFRESH_TOKEN_SECRET || "refreshsecret";

export interface TokenPayload {
  _id: string;
  role: "admin" | "student" | "teacher" | "other";
  fullName: string;
  phoneNumber: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
  const expiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN || "1h") as any;
  return jwt.sign(payload as object, ACCESS_TOKEN_SECRET, { expiresIn });
};

export const generateRefreshToken = (payload: TokenPayload) => {
  const expiresIn = (process.env.REFRESH_TOKEN_EXPIRES_IN || "30d") as any;
  return jwt.sign(payload as object, REFRESH_TOKEN_SECRET, { expiresIn });
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

export const generateAccessTokenAndRefreshToken = async (user: any) => {
  try {
    const payload = {
      _id: user._id,
      role: user.role,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await user.updateOne({ refreshToken });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new Error("Token generation failed");
  }
};
