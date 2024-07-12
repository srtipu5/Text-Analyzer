import { UserModel } from "../Database/Model/UserModel";
import { UserRepo } from "../Database/Repository/UserRepo";
import CacheService from "../Service/CacheService";
import { UserRegisterParams } from "../Type/Request";
import { AppError } from "../Util/Exception";
import { hashPassword } from "../Util/Helper";

export class UserProcessAction {
  private userRepo: UserRepo;

  constructor() {
    this.userRepo = new UserRepo();
  }

  async saveUser(reqUser: UserRegisterParams): Promise<UserModel> {
    await this.ensureUserDoesNotExist(reqUser.email);
    const user = await this.initializeUser(reqUser);
    
    // Cache the user data
    CacheService.set(`user:${user.email}`, user, 30); // Cache for 30 minutes
    
    return this.saveUserToRepo(user, "Error saving user");
  }

  async updateUser(id: number, reqPassword: string): Promise<UserModel> {
    const user = await this.findUserByIdOrThrow(id);
    await this.updateUserPassword(user, reqPassword);
    
    // Update the cache
    CacheService.set(`user:${user.email}`, user, 30); // Update cache for 30 minutes
    
    return this.saveUserToRepo(user, "Error updating user");
  }

  async deleteUser(id: number): Promise<UserModel> {
    const user = await this.findUserByIdOrThrow(id);
    const deletedUser = await this.userRepo.delete(user);
    if (!deletedUser) {
      throw new AppError(400, "Error deleting user");
    }

    // Remove from cache
    CacheService.del(`user:${user.email}`);
    
    return deletedUser;
  }

  async listOfUser(): Promise<UserModel[]> {
    const users = await this.userRepo.find();
    if (!users) {
      throw new AppError(404, `User not found`);
    }
    return users;
  }

  async findUserByEmail(email: string): Promise<UserModel> {
    // Try to get from cache first
    const cachedUser = CacheService.get(`user:${email}`);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(404, `User not found`);
    }
    
    // Cache the user data
    CacheService.set(`user:${email}`, user, 30); // Cache for 30 minutes
    
    return user;
  }

  private async initializeUser(reqUser: UserRegisterParams): Promise<UserModel> {
    const user = new UserModel();
    user.email = reqUser.email;
    user.password = await hashPassword(reqUser.password);
    return user;
  }

  private async updateUserPassword(user: UserModel, password: string): Promise<void> {
    user.password = await hashPassword(password);
  }

  private async ensureUserDoesNotExist(email: string): Promise<void> {
    if (await this.userRepo.findByEmail(email)) {
      throw new AppError(409, `User already exists`);
    }
  }

  private async findUserByIdOrThrow(id: number): Promise<UserModel> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError(404, `User not found`);
    }
    return user;
  }

  private async saveUserToRepo(user: UserModel, errorMessage: string): Promise<UserModel> {
    const savedUser = await this.userRepo.save(user);
    if (!savedUser) {
      throw new AppError(400, errorMessage);
    }
    return savedUser;
  }
}
