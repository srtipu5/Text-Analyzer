import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { UserModel } from '../Database/Model/UserModel';
import { AppError } from '../Util/Exception';

export class UserAuthProcessAction {
  private static JWT_EXPIRATION_TIME = 30 * 60; // 30 minutes

  buildPayload(user: UserModel): UserModel {
    return { ...user };
  }

  getToken(payload: UserModel): string {
    return jwt.sign(payload, this.getJwtSecret(), {
      expiresIn: UserAuthProcessAction.JWT_EXPIRATION_TIME,
    });
  }

  getLoggedInUserDetails(req: IncomingMessage): UserModel {
    const token = this.extractToken(req);
    return this.verifyToken(token);
  }

  private getJwtSecret(): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError(500, "JWT_SECRET variable is not defined");
    }
    return jwtSecret;
  }

  private extractToken(req: IncomingMessage): string {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      throw new AppError(401, "Authorization header missing");
    }
  
    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new AppError(401, "Token missing");
    }
  
    return token;
  }

  private verifyToken(token: string): UserModel {
    try {
      return jwt.verify(token, this.getJwtSecret()) as UserModel;
    } catch (error) {
      throw new AppError(401, "Invalid or expired token");
    }
  }
}
