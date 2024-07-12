import { getRepository, Repository } from "typeorm";
import { TextModel } from "../Model/TextModel";
import { log } from "../../Util/Helper";

export class TextRepo {
  private repo: Repository<TextModel>;

  constructor() {
    this.repo = getRepository(TextModel);
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

  find(): Promise<TextModel[] | null> {
    return this.executeQuery(
      this.repo.find({ order: { id: "ASC" } })
    );
  }

  findByUserId(userId: number): Promise<TextModel[] | null> {
    return this.executeQuery(
      this.repo.find({ where: { userId }, order: { id: "ASC" } })
    );
  }

  findById(id: number): Promise<TextModel | null> {
    return this.executeQuery(
      this.repo.findOne({ where: { id } })
    );
  }

  save(text: TextModel): Promise<TextModel | null> {
    return this.executeQuery(
      this.repo.save(text)
    );
  }

  delete(text: TextModel): Promise<TextModel | null> {
    return this.executeQuery(
      this.repo.remove(text)
    );
  }
}
