
import { TextModel } from "../../Database/Model/TextModel";
import { findByUserId } from "../../Database/Repository/TextRepository";
import { log } from "../../Util/Helper";

export const findTextByUserId = async (userId: number): Promise<TextModel[] | null> => {
    try {
      return await findByUserId(userId);
    } catch (error) {
      log(error);
      return null;
    }
  };