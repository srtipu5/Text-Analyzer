import { TextAnalysisProperty } from "../Type/TextAnalysisProperty";
import { TextRepo } from "../Database/Repository/TextRepo";
import { UserModel } from "../Database/Model/UserModel";
import { AppError } from "../Util/Exception";

export class TextAnalysisProcessAction {
  async getAnalysisReport(id: number, loggedInUser: UserModel, property: TextAnalysisProperty): Promise<number | string> {
    
    const text = await new TextRepo().findById(id);
    if (text?.userId !== loggedInUser.id && loggedInUser.role !== "admin") {
      throw new AppError(403, "You don't have access");
    }
    if (!text){
        throw new AppError(400, "Text not found");
    }

    return text[property] as number | string;
  }
}
