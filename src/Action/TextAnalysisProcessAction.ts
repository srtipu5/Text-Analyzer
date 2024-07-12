import { errorApiResponse, log, successApiResponse } from "../Util/Helper";
import { TextAnalysisProperty } from "../Type/TextAnalysisProperty";
import { TextRepo } from "../Database/Repository/TextRepo";
import { UserModel } from "../Database/Model/UserModel";
import { ApiResponse } from "../Type/Response";

export class TextAnalysisProcessAction {

    async getAnalysisReport(id: number, loggedInUser: UserModel, property: TextAnalysisProperty): Promise<number | string | null | ApiResponse> {
        try {
            const text = await new TextRepo().findById(id);
            if(text?.userId !== loggedInUser.id && loggedInUser.role !== 'admin'){
                return errorApiResponse("You don't have access");
            }
            if (!text) return errorApiResponse("Not found");
            
            return successApiResponse("Successfully fetched", text[property] as number | string);
        } catch (error) {
            log(error);
            return errorApiResponse("Internal server error");
        }
      };

}