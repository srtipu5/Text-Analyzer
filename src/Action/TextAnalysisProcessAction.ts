import { log } from "../Util/Helper";
import { TextAnalysisProperty } from "../Type/TextAnalysisProperty";
import { TextRepo } from "../Database/Repository/TextRepo";

export class TextAnalysisProcessAction {

    async getAnalysisReport(id: number, property: TextAnalysisProperty): Promise<number | string | null> {
        try {
            const text = await new TextRepo().findById(id);
            if (!text) return null;
            return text[property] as number | string;
        } catch (error) {
            log(error);
            return null;
        }
      };

}