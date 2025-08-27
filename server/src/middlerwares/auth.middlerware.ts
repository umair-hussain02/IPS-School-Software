import { Request, Response, NextFunction } from "express";
import { TokenPayload, verifyAccessToken } from "../utils/jwt";
import { asyncHandler } from "../utils/asyncHandler";
import { Teacher } from "../modules/users/teacher/teacher.model";
import { Student } from "../modules/users/student/student.model";
import { Admin } from "../modules/users/admin/admin.model";

/*export const authMiddleware = (roles: string[] = []) => {
  return (
    req: Request & { user: TokenPayload },
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization as string | undefined;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided..." });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = verifyAccessToken(token) as TokenPayload;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          message: "Forbidden: Insufficient permissions",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};


*/

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.AccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    const decoded = verifyAccessToken(token);

    let user;
    if (decoded && decoded.role === "teacher") {
      user = await Teacher.findById(decoded._id).select("-password");
    }
    if (decoded && decoded.role === "student") {
      user = await Student.findById(decoded._id).select("-password");
    }
    if (decoded && decoded.role === "admin") {
      user = await Admin.findById(decoded._id).select("-password");
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    req.user = user;
    next();
  }
);
