import { deleteById } from "../../Database/Repository/TextRepository";
import { log } from "../../Util/Helper";


export const deleteText = async (id: number): Promise<Boolean> => {
    try {
      return await deleteById(id);
    } catch (error) {
      log(error);
      return false;
    }
  };