import { TextAnalysisProcessAction } from "../../Action/TextAnalysisProcessAction";
import { TextModel } from "../../Database/Model/TextModel";
import { UserModel } from "../../Database/Model/UserModel";
import { TextRepo } from "../../Database/Repository/TextRepo";
import { TextAnalysisProperty } from "../../Type/TextAnalysisProperty";
import { AppError } from "../../Util/Exception";


jest.mock("../../Database/Repository/TextRepo");

describe("TextAnalysisProcessAction Test:", () => {

  let textAnalysisProcessAction: TextAnalysisProcessAction;
  let mockTextRepo: jest.Mocked<TextRepo>;
  let loggedInUser: UserModel;
  let text: TextModel;

  beforeEach(() => {
    textAnalysisProcessAction = new TextAnalysisProcessAction();
    mockTextRepo = new TextRepo() as jest.Mocked<TextRepo>;

    loggedInUser = { id: 1, role: "admin" } as UserModel;
    text = new TextModel();
    text.id = 1;
    text.userId = 1;
    text.wordCount = 100;
    text.longestWord = "example";
    // Initialize other properties as needed

    (TextRepo as jest.Mock).mockImplementation(() => mockTextRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return report if the user has access", async () => {
    mockTextRepo.findById.mockResolvedValue(text);

    const result = await textAnalysisProcessAction.getAnalysisReport(
      1,
      loggedInUser,
      "wordCount" as TextAnalysisProperty
    );

    expect(result).toBe(100);
    expect(mockTextRepo.findById).toHaveBeenCalledWith(1);
  });

  it("should throw an error if the text is not found", async () => {
    mockTextRepo.findById.mockResolvedValue(null);

    await expect(
      textAnalysisProcessAction.getAnalysisReport(
        1,
        loggedInUser,
        "wordCount" as TextAnalysisProperty
      )
    ).rejects.toThrow(new AppError(400, "Text not found"));
  });

  it("should throw an error if the user does not have access", async () => {
    text.userId = 2; // Ensure the text's userId is different from loggedInUser.id
    mockTextRepo.findById.mockResolvedValue(text);

    await expect(
      textAnalysisProcessAction.getAnalysisReport(
        1,
        loggedInUser,
        "wordCount" as TextAnalysisProperty
      )
    ).rejects.toThrow(new AppError(403, "You don't have access"));
  });

  it("should return the analysis report if the logged in user is an admin", async () => {
    loggedInUser.role = "admin";
    text.userId = 2;
    mockTextRepo.findById.mockResolvedValue(text);

    const result = await textAnalysisProcessAction.getAnalysisReport(
      1,
      loggedInUser,
      "longestWord" as TextAnalysisProperty
    );

    expect(result).toBe("example");
    expect(mockTextRepo.findById).toHaveBeenCalledWith(1);
  });
});
