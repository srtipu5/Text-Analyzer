import { UserModel } from "../../Database/Model/UserModel";
import { findById } from "../../Database/Repository/UserRepository";
import { log } from "../../Util/Helper";

export const findUserById = async (id: number): Promise<UserModel | null> => {
    try {
      return await findById(id);
    } catch (error) {
      log(error);
      return null;
    }
  };