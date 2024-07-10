import { TextModel } from "../../Database/Model/TextModel";
import { save } from "../../Database/Repository/TextRepository";
import { TextAnalysisService } from "../../Service/TextAnalysisService";
import { log } from "../../Util/Helper";

export const saveText = async (reqContent: string, userId: number): Promise<boolean> => {
    try {
        const text = createTextModelInstance(reqContent, userId);
        return await save(text);
    } catch (error) {
        log(error);
        return false;
    }
};

const createTextModelInstance = (reqContent: string, userId: number): TextModel => {
  const text = new TextModel();
  text.content = reqContent;
  text.characterCount = TextAnalysisService.countCharacters(reqContent);
  text.wordCount = TextAnalysisService.countWords(reqContent);
  text.sentenceCount = TextAnalysisService.countSentences(reqContent);
  text.paragraphCount = TextAnalysisService.countParagraphs(reqContent);
  text.longestWord = TextAnalysisService.findLongestWord(reqContent);
  text.userId = userId; 
  return text;
};


