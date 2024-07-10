import jwt from 'jsonwebtoken';
import { AuthBodyParams } from '../../Request/Auth/AuthBodyParams';
import { AuthResponse } from '../../Response/Auth/AuthResponse';

export const authenticate = (reqBody: AuthBodyParams): AuthResponse => {
  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET variable is not defined");
    }

    const { username, password } = reqBody;

    // In prod it will be handled by DB
    if (username !== "testUsername" || password !== "testPassword") {
      return { success: false, errorCode: 401 };
    }

    const user = { username, password };
    const token = jwt.sign(user, jwtSecret, { expiresIn: "1h" });

    return { success: true, token };
  } catch (error) {
    console.error(error);
    return { success: false, errorCode: 500 };
  }
};
