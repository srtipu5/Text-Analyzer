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
      return await this.repo.find();
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

  async save(user: UserModel): Promise<UserModel | null> {
    try {
      return await this.repo.save(user);
    } catch (error) {
      log("Error in save:", error);
      return null;
    }
  }

  async delete(user: UserModel): Promise<UserModel | null> {
    try {
      return await this.repo.remove(user);
    } catch (error) {
      log("Error in delete:", error);
      return null;
    }
  }

}
