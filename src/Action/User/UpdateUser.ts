import { findById, save } from "../../Database/Repository/UserRepository";
import { log } from "../../Util/Helper";
import { UserModel } from "../../Database/Model/UserModel";
import { hashPassword } from "./HashPassword";

export const updateUser = async (id: number, reqPassword: string): Promise<Boolean> => {
    try {
      const user = await findById(id);
      if(!user) return false;
      await updateUserModel(user, reqPassword)
      return await save(user);

    } catch (error) {
      log(error);
      return false;
    }
  };

  const updateUserModel = async(user: UserModel, password: string): Promise<void> => {
    user.password = await hashPassword(password);
};