import bcrypt from "bcrypt";

export function log (...params: any) {
  console.log(new Date(), ...params)
}

export function getErrorMessage (errorCode: number): string {
    switch (errorCode) {
      case 401:
        return "Invalid username or password";
      case 500:
        return "Internal server error";
      default:
        return "Unknown error";
    }
  };

 
export async function hashPassword (password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}