import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { UserModel } from '../Database/Model/UserModel';

export class UserAuthProcessAction {
    buildPayload(user: UserModel): UserModel {
      return { ...user };
    };

    getToken(payload: UserModel): string {
      const tokenExpiresInSecond = 30 * 60; // 30 minutes
      const token = jwt.sign(payload, this.getJwtSecret(), {
        expiresIn: tokenExpiresInSecond,
      });
      return token;
    };

    getLoggedInUserDetails (req: IncomingMessage): any {
      const authorizationHeader = req.headers['authorization'];
      if (!authorizationHeader) {
        throw new Error("Authorization header missing");
      }
  
      const token = authorizationHeader.split(' ')[1];
      if (!token) {
        throw new Error("Token missing");
      }
      const userDetails = jwt.verify(token, this.getJwtSecret());
      return userDetails;
    };

    getJwtSecret (): string {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET variable is not defined");
      }
      return jwtSecret;
    };
  

}