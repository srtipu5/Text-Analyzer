import { UserModel } from "../../Database/Model/UserModel";
import { findAll } from "../../Database/Repository/UserRepository";
import { log } from "../../Util/Helper";

export const listOfUsers = async (): Promise<UserModel[] | null> => {
    try {
      return await findAll();
    } catch (error) {
      log(error);
      return null;
    }
  };