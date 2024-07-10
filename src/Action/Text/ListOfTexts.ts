import { TextModel } from "../../Database/Model/TextModel";
import { findAll } from "../../Database/Repository/TextRepository";
import { log } from "../../Util/Helper";

export const listOfTexts = async (): Promise<TextModel[] | null> => {
    try {
      return await findAll();
    } catch (error) {
      log(error);
      return null;
    }
  };