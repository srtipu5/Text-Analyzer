import { TextModel } from "../Database/Model/TextModel";
import { TextRepo } from "../Database/Repository/TextRepo";
import { TextAnalysisService } from "../Service/TextAnalysisService";
import { log } from "../Util/Helper";

export class TextProcessAction {
  async saveText(reqContent: string, userId: number): Promise<boolean> {
    try {
      const text = await this.initializeText(reqContent, userId);
      return await new TextRepo().save(text);
    } catch (error) {
      log(error);
      return false;
    }
  }

  async updateText(id: number, reqContent: string, userId: number): Promise<boolean> {
    try {
      const text = await new TextRepo().findById(id);
      if (!text) return false;
      this.updateTextInstance(text, reqContent, userId);
      return await new TextRepo().save(text);
    } catch (error) {
      log(error);
      return false;
    }
  }

  async deleteText(id: number): Promise<Boolean> {
    try {
      return await new TextRepo().deleteById(id);
    } catch (error) {
      log(error);
      return false;
    }
  }

  async listOfText(): Promise<TextModel[] | null> {
    try {
      return await new TextRepo().find();
    } catch (error) {
      log(error);
      return null;
    }
  }

  async findTextById(id: number): Promise<TextModel | null> {
    try {
      return await new TextRepo().findById(id);
    } catch (error) {
      log(error);
      return null;
    }
  }

  async findTextByUserId(userId: number): Promise<TextModel[] | null> {
    try {
      return await new TextRepo().findByUserId(userId);
    } catch (error) {
      log(error);
      return null;
    }
  }

  async initializeText(reqContent: string, userId: number): Promise<TextModel> {
    const text = new TextModel();
    text.content = reqContent;
    text.characterCount = TextAnalysisService.countCharacters(reqContent);
    text.wordCount = TextAnalysisService.countWords(reqContent);
    text.sentenceCount = TextAnalysisService.countSentences(reqContent);
    text.paragraphCount = TextAnalysisService.countParagraphs(reqContent);
    text.longestWord = TextAnalysisService.findLongestWord(reqContent);
    text.userId = userId;
    return text;
  }

  updateTextInstance(text: TextModel, reqContent: string, userId: number): void {
    text.content = reqContent;
    text.characterCount = TextAnalysisService.countCharacters(reqContent);
    text.wordCount = TextAnalysisService.countWords(reqContent);
    text.sentenceCount = TextAnalysisService.countSentences(reqContent);
    text.paragraphCount = TextAnalysisService.countParagraphs(reqContent);
    text.longestWord = TextAnalysisService.findLongestWord(reqContent);
    text.userId = userId;
  }
}
