import { TextModel } from "../Database/Model/TextModel";
import { UserModel } from "../Database/Model/UserModel";
import { TextRepo } from "../Database/Repository/TextRepo";
import { TextAnalysisService } from "../Service/TextAnalysisService";
import { ApiResponse } from "../Type/Response";
import { errorApiResponse, log, successApiResponse } from "../Util/Helper";

export class TextProcessAction {
  async saveText(reqContent: string, loggedInUser: UserModel): Promise<ApiResponse> {
    try {
      const text = await this.initializeText(reqContent, loggedInUser.id);

      const result = await new TextRepo().save(text);
      if (!result) return errorApiResponse("Error saving text");

      return successApiResponse("Text successfully saved", result);
    } catch (error) {
      log(error);
      return errorApiResponse("Internal server error");
    }
  }

  async updateText(id: number, reqContent: string, loggedInUser: UserModel): Promise<ApiResponse> {
    try {
      const text = await new TextRepo().findById(id);

      if(text?.userId !== loggedInUser.id && loggedInUser.role !== 'admin'){
        return errorApiResponse("You don't have access");
      }

      if (!text) return errorApiResponse("Not found");

      this.updateTextInstance(text, reqContent, loggedInUser.id);

      const result = await new TextRepo().save(text)
      if (!result) return errorApiResponse("Error updating text");

      return successApiResponse("Text successfully updated", result);
    } catch (error) {
      log(error);
      return errorApiResponse("Internal server error");
    }
  }

  async deleteText(id: number, loggedInUser: UserModel): Promise<ApiResponse> {
    try {
      const text = await new TextRepo().findById(id);
      if(text?.userId !== loggedInUser.id && loggedInUser.role !== 'admin'){
        return errorApiResponse("You don't have access");
      }

      if (!text) return errorApiResponse("Not found");

      const result = await new TextRepo().delete(text);
      if (!result) return errorApiResponse("Error deleting text");

      return successApiResponse("Text successfully deleted", result);
    } catch (error) {
      log(error);
      return errorApiResponse("Internal server error");
    }
  }

  async listOfText(): Promise<ApiResponse> {
    try {
      const result = await new TextRepo().find();
      if (!result) return errorApiResponse("Error fetching text");

      return successApiResponse("Text successfully fetched", result);
    } catch (error) {
      log(error);
      return errorApiResponse("Internal server error");
    }
  }

  async findTextById(id: number, loggedInUser: UserModel): Promise<ApiResponse> {
    try {

      const text = await new TextRepo().findById(id);
      if(text?.userId !== loggedInUser.id && loggedInUser.role !== 'admin'){
        return errorApiResponse("You don't have access");
      }

      if (!text) return errorApiResponse("Error fetching text");

      return successApiResponse("Text successfully fetched", text);
    } catch (error) {
      log(error);
      return errorApiResponse("Internal server error");
    }
  }

  async findTextByUserId(userId: number): Promise<ApiResponse> {
    try {
      const result = await new TextRepo().findByUserId(userId);
      if (!result) return errorApiResponse("Not found");

      return successApiResponse("Text successfully fetched", result);
    } catch (error) {
      log(error);
      return errorApiResponse("Internal server error");
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
