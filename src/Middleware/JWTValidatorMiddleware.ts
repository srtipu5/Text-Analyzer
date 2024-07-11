import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function JWTValidator(req: any, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}
