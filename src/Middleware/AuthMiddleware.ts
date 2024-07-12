import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorApiResponse } from "../Util/Helper";

export function AuthMiddleware(req: any, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json(errorApiResponse("Authentication token is missing or invalid"));
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json(errorApiResponse("Unauthorized"));
    }
    req.user = user;
    next();
  });
}
