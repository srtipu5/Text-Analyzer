import { UserModel } from "../Database/Model/UserModel";
import { UserRepo } from "../Database/Repository/UserRepo";
import { UserRegisterParams } from "../Type/Request";
import { ApiResponse } from "../Type/Response";
import {
  hashPassword,
  log,
  successApiResponse,
  errorApiResponse
} from "../Util/Helper";

export class UserProcessAction {
  async saveUser(reqUser: UserRegisterParams): Promise<ApiResponse> {
    try {
      if (await new UserRepo().findByEmail(reqUser.email)) {
        return errorApiResponse("User already exists");
      }

      const user = await this.initializeUser(reqUser);
      const result = await new UserRepo().save(user);
      if (!result) return errorApiResponse("Error saving user");

      return successApiResponse("User successfully saved", result);
    } catch (error) {
      log(error);
      return errorApiResponse("Internal server error");
    }
  }

  async updateUser(id: number, reqPassword: string): Promise<ApiResponse> {
    try {
      const user = await new UserRepo().findById(id);
      if (!user) return errorApiResponse("Not found");
      await this.updateUserPassword(user, reqPassword);
      const result = await new UserRepo().save(user);
      if (!result) return errorApiResponse("Error updating user");

      return successApiResponse("User successfully updated", result); 
    } catch (error) {
      log(error);
      return errorApiResponse("Internal server error");
    }
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    try {
      const user = await new UserRepo().findById(id);
      if (!user) return errorApiResponse("Not found");
      const result = await new UserRepo().delete(user);
      if (!result) return errorApiResponse("Error deleting user");

      return successApiResponse("User successfully deleted", result);  
    } catch (error) {
      log(error);
      return errorApiResponse("Internal server error");
    }
  }

  async listOfUser(): Promise<ApiResponse> {
    try {
      const users = await new UserRepo().find();
      return successApiResponse("Users successfully fetched", users);  
    } catch (error) {
      log(error);
      return errorApiResponse("Internal server error");
    }
  }

  async findUserByEmail(email: string): Promise<ApiResponse> {
    try {
      const user = await new UserRepo().findByEmail(email);
      if(!user) return errorApiResponse("Not found"); 
      return successApiResponse("User successfully fetched", user); 
    } catch (error) {
      log(error);
      return errorApiResponse("Internal server error");
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
