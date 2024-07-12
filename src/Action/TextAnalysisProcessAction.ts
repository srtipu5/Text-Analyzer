import { TextAnalysisProperty } from "../Type/TextAnalysisProperty";
import { TextRepo } from "../Database/Repository/TextRepo";
import { UserModel } from "../Database/Model/UserModel";
import { AppError } from "../Util/Exception";

export class TextAnalysisProcessAction {
  async getAnalysisReport(id: number, loggedInUser: UserModel, property: TextAnalysisProperty): Promise<number | string> {
    
    const text = await new TextRepo().findById(id);
    
    if (!text){
        throw new AppError(404, "Text not found");
    }
    if (text.userId !== loggedInUser.id && loggedInUser.role !== "admin") {
      throw new AppError(403, "You don't have access");
    }

    return text[property] as number | string;
  }
}
