import jwt from 'jsonwebtoken';
import { AuthResponse } from "../Type/Response";
import { UserAuthParams } from '../Type/Request';

export class UserAuthProcessAction {
    
 async authenticate(reqBody: UserAuthParams): Promise<AuthResponse> {
  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET variable is not defined");
    }

    const { email, password } = reqBody;

    // In prod it will be handled by DB
    if (email !== "test@gmail.com" || password !== "testPassword") {
      return { success: false, errorCode: 401 };
    }

    const user = { email, password };
    const token = jwt.sign(user, jwtSecret, { expiresIn: "1h" });

    return { success: true, token };
  } catch (error) {
    console.error(error);
    return { success: false, errorCode: 500 };
  }
};

}