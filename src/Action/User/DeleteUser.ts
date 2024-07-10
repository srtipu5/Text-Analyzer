import { deleteById } from "../../Database/Repository/UserRepository";
import { log } from "../../Util/Helper";

export const deleteUser = async (id: number): Promise<Boolean> => {
    try {
      return await deleteById(id);
    } catch (error) {
      log(error);
      return false;
    }
  };