import { Request, Response, NextFunction } from "express";
import { TokenPayload, verifyAccessToken } from "../utils/jwt";

export const authMiddleware = (roles: string[] = []) => {
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
