import { UserModel } from "../../Database/Model/UserModel";
import { findByEmail } from "../../Database/Repository/UserRepository";
import { log } from "../../Util/Helper";

export const findUserByEmail = async (email: string): Promise<UserModel | null> => {
    try {
      return await findByEmail(email);
    } catch (error) {
      log(error);
      return null;
    }
  };