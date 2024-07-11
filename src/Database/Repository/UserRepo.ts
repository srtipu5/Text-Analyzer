import { getRepository, Repository } from "typeorm";
import { UserModel } from "../Model/UserModel";
import { log } from "../../Util/Helper";

export class UserRepo {
    
  private repo: Repository<UserModel>;
  constructor() {
    this.repo = getRepository(UserModel);
  }

  async find(): Promise<UserModel[] | null> {
    try {
      const users = await this.repo.find();
      return users || null;
    } catch (error) {
      log("Error in find:", error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    try {
      const user = await this.repo.findOne({ where: { email } });
      return user || null;
    } catch (error) {
      log("Error in findByEmail:", error);
      return null;
    }
  }

  async findById(id: number): Promise<UserModel | null> {
    try {
      const user = await this.repo.findOne({ where: { id } });
      return user || null;
    } catch (error) {
      log("Error in findById:", error);
      return null;
    }
  }

  async save(user: UserModel): Promise<boolean> {
    try {
      await this.repo.save(user);
      return true;
    } catch (error) {
      log("Error in save user:", error);
      return false;
    }
  }

  async deleteById(id: number): Promise<boolean> {
    try {
      const user = await this.findById(id);
      if (!user) return false;
      await this.repo.remove(user);
      return true;
    } catch (error) {
      log("Error in deleteById:", error);
      return false;
    }
  }

  async deleteByEmail(email: string): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);
      if (!user) return false;
      await this.repo.remove(user);
      return true;
    } catch (error) {
      log("Error in deleteByEmail:", error);
      return false;
    }
  }
}
