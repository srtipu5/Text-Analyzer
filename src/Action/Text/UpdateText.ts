import { TextModel } from "../../Database/Model/TextModel";
import { save } from "../../Database/Repository/TextRepository";
import { TextAnalysisService } from "../../Service/TextAnalysisService";
import { log } from "../../Util/Helper";
import { findTextById } from "./FindTextById";

export const updateText = async (id: number, reqContent: string, userId: number): Promise<boolean> => {
    try {
        const text = await findTextById(id);
        if (!text) return false;

        updateTextModel(text, reqContent, userId);
        return await save(text);
    } catch (error) {
        log(error);
        return false;
    }
};

const updateTextModel = (text: TextModel, reqContent: string, userId: number): void => {
    text.content = reqContent;
    text.characterCount = TextAnalysisService.countCharacters(reqContent);
    text.wordCount = TextAnalysisService.countWords(reqContent);
    text.sentenceCount = TextAnalysisService.countSentences(reqContent);
    text.paragraphCount = TextAnalysisService.countParagraphs(reqContent);
    text.longestWord = TextAnalysisService.findLongestWord(reqContent);
    text.userId = userId;
};
