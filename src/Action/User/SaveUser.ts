import bcrypt from "bcrypt";
import { UserModel } from "../../Database/Model/UserModel";
import { save } from "../../Database/Repository/UserRepository";
import { UserRegisterParams } from "../../Request/ReqParams";
import { log } from "../../Util/Helper";
import { hashPassword } from "./HashPassword";

export const saveUser = async (reqUser: UserRegisterParams): Promise<Boolean> => {
    try {
      const user = await createUserModelInstance(reqUser);
      return await save(user);
    } catch (error) {
      log(error);
      return false;
    }
  };

 const createUserModelInstance = async (reqUser: UserRegisterParams): Promise<UserModel> => {
  const user = new UserModel();
  user.email = reqUser.email;
  user.password = await hashPassword(reqUser.password);
  return user;
};
