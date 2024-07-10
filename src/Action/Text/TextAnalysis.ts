import { findById } from "../../Database/Repository/TextRepository";
import { TextAnalysisProperty } from "../../Util/TextAnalysisProperty";
import { log } from "../../Util/Helper";

export const getAnalysisResult = async (id: number, property: TextAnalysisProperty): Promise<number | string | null> => {
  try {
      const text = await findById(id);
      if (!text) return null;
      return text[property] as number | string;
  } catch (error) {
      log(error);
      return null;
  }
};

