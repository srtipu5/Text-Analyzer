import { getRepository, Repository } from "typeorm";
import { TextModel } from "../Model/TextModel";
import { log } from "../../Util/Helper";

export class TextRepo {
    
  private repo: Repository<TextModel>;
  constructor() {
    this.repo = getRepository(TextModel);
  }

  async find(): Promise<TextModel[] | null> {
    try {
      const texts = await this.repo.find();
      return texts || null;
    } catch (error) {
      log("Error in findAll:", error);
      return null;
    }
  }

  async findByUserId(userId: number): Promise<TextModel[] | null> {
    try {
      const texts = await this.repo.find({ where: { userId } });
      return texts || null;
    } catch (error) {
      log("Error in findByUserId:", error);
      return null;
    }
  }

  async findById(id: number): Promise<TextModel | null> {
    try {
      const text = await this.repo.findOne({ where: { id } });
      return text || null;
    } catch (error) {
      log("Error in findById:", error);
      return null;
    }
  }

  async save(text: TextModel): Promise<boolean> {
    try {
      await this.repo.save(text);
      return true;
    } catch (error) {
      log("Error in save text:", error);
      return false;
    }
  }

  async deleteById(id: number): Promise<boolean> {
    try {
      const text = await this.findById(id);
      if (!text) return false;
      await this.repo.remove(text);
      return true;
    } catch (error) {
      log("Error in deleteById:", error);
      return false;
    }
  }
}
