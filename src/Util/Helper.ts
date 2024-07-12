import bcrypt from "bcrypt";
import { uuid } from "licia";
import { ApiResponse } from "../Type/Response";

export function log(...params: any) {
  console.log(new Date(), ...params);
}

export function successApiResponse(message: string, data?: any): ApiResponse {
  return { message, data };
}

export function errorApiResponse(message: string): ApiResponse {
  return { message };
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword( reqPassword: string, userPassword: string): Promise<Boolean> {
  return await bcrypt.compareSync(reqPassword, userPassword);
}

export function getUserKey(id : number): string {
  return `userId_${id}`;
}

export function getRefreshTokenKey() : string{
  return uuid();
}
