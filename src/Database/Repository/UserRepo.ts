import { getRepository, Repository } from "typeorm";
import { UserModel } from "../Model/UserModel";
import { log } from "../../Util/Helper";

export class UserRepo {
  private repo: Repository<UserModel>;

  constructor() {
    this.repo = getRepository(UserModel);
  }

  private async executeQuery<T>(query: Promise<T>): Promise<T | null> {
    try {
      const result = await query;
      return result || null;
    } catch (error) {
      log("Database query error:", error);
      return null;
    }
  }

  find(): Promise<UserModel[] | null> {
    return this.executeQuery(
      this.repo.find({ order: { id: "ASC" } })
    );
  }

  findByEmail(email: string): Promise<UserModel | null> {
    return this.executeQuery(
      this.repo.findOne({ where: { email } })
    );
  }

  findById(id: number): Promise<UserModel | null> {
    return this.executeQuery(
      this.repo.findOne({ where: { id } })
    );
  }

  save(user: UserModel): Promise<UserModel | null> {
    return this.executeQuery(
      this.repo.save(user)
    );
  }

  delete(user: UserModel): Promise<UserModel | null> {
    return this.executeQuery(
      this.repo.remove(user)
    );
  }
}
