import { UserModel } from "../Database/Model/UserModel";
import { UserRepo } from "../Database/Repository/UserRepo";
import { UserRegisterParams } from "../Type/Request";
import { hashPassword, log } from "../Util/Helper";

export class UserProcessAction {
  async saveUser(reqUser: UserRegisterParams): Promise<boolean> {
    try {
      if (await new UserRepo().findByEmail(reqUser.email)) return false; // check user
      const user = await this.initializeUser(reqUser);
      return await new UserRepo().save(user);
    } catch (error) {
      log(error);
      return false;
    }
  }

  async updateUser(id: number, reqPassword: string): Promise<Boolean> {
    try {
      const user = await new UserRepo().findById(id);
      if (!user) return false;
      await this.updateUserPassword(user, reqPassword);
      return await new UserRepo().save(user);
    } catch (error) {
      log(error);
      return false;
    }
  }

  async deleteUser(id: number): Promise<Boolean> {
    try {
      return await new UserRepo().deleteById(id);
    } catch (error) {
      log(error);
      return false;
    }
  }

  async listOfUser(): Promise<UserModel[] | null> {
    try {
      return await new UserRepo().find();
    } catch (error) {
      log(error);
      return null;
    }
  }

  async findUserByEmail(email: string): Promise<UserModel | null> {
    try {
      return await new UserRepo().findByEmail(email);
    } catch (error) {
      log(error);
      return null;
    }
  }

  async initializeUser(reqUser: UserRegisterParams): Promise<UserModel> {
    const user = new UserModel();
    user.email = reqUser.email;
    user.password = await hashPassword(reqUser.password);
    return user;
  }

  async updateUserPassword(user: UserModel, password: string): Promise<void> {
    user.password = await hashPassword(password);
  }
}
