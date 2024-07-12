import { TextProcessAction } from "../../Action/TextProcessAction";
import { TextModel } from "../../Database/Model/TextModel";
import { UserModel } from "../../Database/Model/UserModel";
import { TextRepo } from "../../Database/Repository/TextRepo";
import { TextAnalysisService } from "../../Service/TextAnalysisService";
import { AppError } from "../../Util/Exception";


jest.mock('../../Database/Repository/TextRepo');
jest.mock('../../Service/TextAnalysisService');

describe('TextProcessAction Test:', () => {
  let textProcessAction: TextProcessAction;
  let textRepoMock: jest.Mocked<TextRepo>;
  let textAnalysisServiceMock: jest.Mocked<typeof TextAnalysisService>;

  beforeEach(() => {
    textRepoMock = new TextRepo() as jest.Mocked<TextRepo>;
    textProcessAction = new TextProcessAction();
    textProcessAction['textRepo'] = textRepoMock;
    textAnalysisServiceMock = TextAnalysisService as jest.Mocked<typeof TextAnalysisService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveText', () => {
    it('should save text and return the saved text model', async () => {
      const reqContent = 'Sample text content.';
      const loggedInUser: UserModel = { id: 1, email: 'srtipu5@gmail.com', role: 'user' } as UserModel;
      const savedText: TextModel = { id: 1, content: reqContent, userId: loggedInUser.id } as TextModel;

      textRepoMock.save.mockResolvedValue(savedText);
      textAnalysisServiceMock.countCharacters.mockReturnValue(20);
      textAnalysisServiceMock.countWords.mockReturnValue(4);
      textAnalysisServiceMock.countSentences.mockReturnValue(1);
      textAnalysisServiceMock.countParagraphs.mockReturnValue(1);
      textAnalysisServiceMock.findLongestWord.mockReturnValue('content');

      const result = await textProcessAction.saveText(reqContent, loggedInUser);

      expect(result).toEqual(savedText);
      expect(textRepoMock.save).toHaveBeenCalledTimes(1);
      expect(textAnalysisServiceMock.countCharacters).toHaveBeenCalledWith(reqContent);
      expect(textAnalysisServiceMock.countWords).toHaveBeenCalledWith(reqContent);
      expect(textAnalysisServiceMock.countSentences).toHaveBeenCalledWith(reqContent);
      expect(textAnalysisServiceMock.countParagraphs).toHaveBeenCalledWith(reqContent);
      expect(textAnalysisServiceMock.findLongestWord).toHaveBeenCalledWith(reqContent);
    });
  });

  describe('updateText', () => {
    it('should update text and return the updated text model', async () => {
      const reqContent = 'Updated text content';
      const loggedInUser: UserModel = { id: 1, email: 'sr@5gmail.com', role: 'user' } as UserModel;
      const existingText: TextModel = { id: 1, content: 'Give me old content.', userId: loggedInUser.id } as TextModel;
      const updatedText: TextModel = { ...existingText, content: reqContent };

      textRepoMock.findById.mockResolvedValue(existingText);
      textRepoMock.save.mockResolvedValue(updatedText);
      textAnalysisServiceMock.countCharacters.mockReturnValue(22);
      textAnalysisServiceMock.countWords.mockReturnValue(4);
      textAnalysisServiceMock.countSentences.mockReturnValue(1);
      textAnalysisServiceMock.countParagraphs.mockReturnValue(1);
      textAnalysisServiceMock.findLongestWord.mockReturnValue('content');

      const result = await textProcessAction.updateText(existingText.id, reqContent, loggedInUser);

      expect(result).toEqual(updatedText);
      expect(textRepoMock.findById).toHaveBeenCalledWith(existingText.id);
      expect(textRepoMock.save).toHaveBeenCalledWith(expect.objectContaining({ content: reqContent }));
    });
  });

  describe('deleteText', () => {
    it('should delete text and return the deleted text model', async () => {
      const loggedInUser: UserModel = { id: 1, email: 'sr@5gmail.com', role: 'user' } as UserModel;
      const existingText: TextModel = { id: 1, content: 'Content to be deleted.', userId: loggedInUser.id } as TextModel;

      textRepoMock.findById.mockResolvedValue(existingText);
      textRepoMock.delete.mockResolvedValue(existingText);

      const result = await textProcessAction.deleteText(existingText.id, loggedInUser);

      expect(result).toEqual(existingText);
      expect(textRepoMock.findById).toHaveBeenCalledWith(existingText.id);
      expect(textRepoMock.delete).toHaveBeenCalledWith(existingText);
    });

    it('should throw an error if text deletion fails', async () => {
      const loggedInUser: UserModel = { id: 1, email: 'srtipu@6gmail.com', role: 'user' } as UserModel;
      const existingText: TextModel = { id: 1, content: 'Content to be deleted', userId: loggedInUser.id } as TextModel;

      textRepoMock.findById.mockResolvedValue(existingText);
      textRepoMock.delete.mockResolvedValue(null);

      await expect(textProcessAction.deleteText(existingText.id, loggedInUser)).rejects.toThrow(AppError);
    });
  });

  describe('listOfText', () => {
    it('should return a list of text models', async () => {
      const texts: TextModel[] = [
        { id: 1, content: 'Content 1', userId: 1 } as TextModel,
        { id: 2, content: 'Content 2', userId: 1 } as TextModel,
      ];

      textRepoMock.find.mockResolvedValue(texts);

      const result = await textProcessAction.listOfText();

      expect(result).toEqual(texts);
      expect(textRepoMock.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if no texts are found', async () => {
      textRepoMock.find.mockResolvedValue(null);

      await expect(textProcessAction.listOfText()).rejects.toThrow(AppError);
    });
  });

  describe('findTextById', () => {
    it('should return the text model if authorized', async () => {
      const loggedInUser: UserModel = { id: 1, email: 'sr@gmail.com', role: 'user' } as UserModel;
      const text: TextModel = { id: 1, content: 'Content', userId: loggedInUser.id } as TextModel;

      textRepoMock.findById.mockResolvedValue(text);

      const result = await textProcessAction.findTextById(text.id, loggedInUser);

      expect(result).toEqual(text);
      expect(textRepoMock.findById).toHaveBeenCalledWith(text.id);
    });

    it('should throw an error if text is not found', async () => {
      const loggedInUser: UserModel = { id: 1, email: 'sr@5gmail.com', role: 'user' } as UserModel;

      textRepoMock.findById.mockResolvedValue(null);

      await expect(textProcessAction.findTextById(1, loggedInUser)).rejects.toThrow(AppError);
    });
  });

  describe('findTextByUserId', () => {
    it('should return a list of text models by user ID', async () => {
      const userId = 1;
      const texts: TextModel[] = [
        { id: 1, content: 'Content 1', userId: userId } as TextModel,
        { id: 2, content: 'Content 2', userId: userId } as TextModel,
      ];

      textRepoMock.findByUserId.mockResolvedValue(texts);

      const result = await textProcessAction.findTextByUserId(userId);

      expect(result).toEqual(texts);
      expect(textRepoMock.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if no texts are found', async () => {
      const userId = 1;

      textRepoMock.findByUserId.mockResolvedValue(null);

      await expect(textProcessAction.findTextByUserId(userId)).rejects.toThrow(AppError);
    });
  });
});
