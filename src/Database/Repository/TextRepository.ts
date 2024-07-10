import { getRepository, Repository } from "typeorm";
import { log } from "../../Util/Helper";
import { TextModel } from "../Model/TextModel";

let textRepository: Repository<TextModel>;

const initializeRepository = () => {
  if (!textRepository) {
    textRepository = getRepository(TextModel);
  }
  return textRepository;
};

export const findAll = async (): Promise<TextModel[] | null> => {
    try {
      const repo = initializeRepository();
      const texts = await repo.find();
      return texts || null;
    } catch (error) {
      log("Error in findAll:", error);
      return null;
    }
  };

export const findByUserId = async (userId: number): Promise<TextModel[] | null> => {
  try {
    const repo = initializeRepository();
    const texts = await repo.find({ where: { userId } });
    return texts || null;
  } catch (error) {
    log("Error in findByUserId:", error);
    return null;
  }
};

export const findById = async (id: number): Promise<TextModel | null> => {
  try {
    const repo = initializeRepository();
    const text = await repo.findOne({ where: { id } });
    return text || null;
  } catch (error) {
    log("Error in findById:", error);
    return null;
  }
};

export const save = async (text: TextModel): Promise<boolean> => {
  try {
    const repo = initializeRepository();
    await repo.save(text);
    return true;
  } catch (error) {
    log("Error in save text:", error);
    return false;
  }
};


export const deleteById = async (id: number): Promise<boolean> => {
  try {
    const repo = initializeRepository();
    const text = await findById(id);
    if (!text) return false;
    await repo.remove(text);
    return true;
  } catch (error) {
    log("Error in deleteById:", error);
    return false;
  }
};

