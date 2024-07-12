import { TextModel } from "../Database/Model/TextModel";
import { UserModel } from "../Database/Model/UserModel";
import { TextRepo } from "../Database/Repository/TextRepo";
import { TextAnalysisService } from "../Service/TextAnalysisService";
import { AppError } from "../Util/Exception";

export class TextProcessAction {
  private textRepo: TextRepo;

  constructor() {
    this.textRepo = new TextRepo();
  }

  async saveText(reqContent: string, loggedInUser: UserModel): Promise<TextModel> {
    const text = this.initializeText(reqContent, loggedInUser.id);
    return this.saveOrUpdateText(text, "saving");
  }

  async updateText(id: number, reqContent: string, loggedInUser: UserModel): Promise<TextModel> {
    const text = await this.getAuthorizedText(id, loggedInUser, "updating");
    this.updateTextInstance(text, reqContent);
    return this.saveOrUpdateText(text, "updating");
  }

  async deleteText(id: number, loggedInUser: UserModel): Promise<TextModel> {
    const text = await this.getAuthorizedText(id, loggedInUser, "deleting");
    const deletedText = await this.textRepo.delete(text);
    if (!deletedText) {
      throw new AppError(400, "Error deleting text");
    }
    return deletedText;
  }

  async listOfText(): Promise<TextModel[]> {
    const texts = await this.textRepo.find();
    if (!texts) {
      throw new AppError(400, "Text not found");
    }
    return texts;
  }

  async findTextById(id: number, loggedInUser: UserModel): Promise<TextModel> {
    return this.getAuthorizedText(id, loggedInUser, "fetching");
  }

  async findTextByUserId(userId: number): Promise<TextModel[]> {
    const texts = await this.textRepo.findByUserId(userId);
    if (!texts) {
      throw new AppError(400, "Text not found");
    }
    return texts;
  }

  private initializeText(reqContent: string, userId: number): TextModel {
    return this.populateText(new TextModel(), reqContent, userId);
  }

  private updateTextInstance(text: TextModel, reqContent: string): void {
    this.populateText(text, reqContent, text.userId);
  }

  private populateText(text: TextModel, reqContent: string, userId: number): TextModel {
    text.content = reqContent;
    text.characterCount = TextAnalysisService.countCharacters(reqContent);
    text.wordCount = TextAnalysisService.countWords(reqContent);
    text.sentenceCount = TextAnalysisService.countSentences(reqContent);
    text.paragraphCount = TextAnalysisService.countParagraphs(reqContent);
    text.longestWord = TextAnalysisService.findLongestWord(reqContent);
    text.userId = userId;
    return text;
  }

  private async saveOrUpdateText(text: TextModel, action: string): Promise<TextModel> {
    const result = await this.textRepo.save(text);
    if (!result) {
      throw new AppError(400, `Error ${action} text`);
    }
    return result;
  }

  private async getAuthorizedText(id: number, loggedInUser: UserModel, action: string): Promise<TextModel> {
    const text = await this.textRepo.findById(id);

    if (!text) {
      throw new AppError(404, `Text not found`);
    }
    
    this.checkAccessPermission(text, loggedInUser, action);
    return text;
  }

  private checkAccessPermission(text: TextModel, loggedInUser: UserModel, action: string): void {
    if (text.userId !== loggedInUser.id && loggedInUser.role !== 'admin') {
      throw new AppError(403, `You don't have access to ${action} this text`);
    }
  }
}
