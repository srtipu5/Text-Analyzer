
import { TextModel } from "../../Database/Model/TextModel";
import { findById } from "../../Database/Repository/TextRepository";
import { log } from "../../Util/Helper";

export const findTextById = async (id: number): Promise<TextModel | null> => {
    try {
      return await findById(id);
    } catch (error) {
      log(error);
      return null;
    }
  };