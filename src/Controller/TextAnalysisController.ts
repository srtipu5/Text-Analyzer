import Controller from "./Controller";
import { NextFunction, Request, Response } from "express";
import { log } from "../Util/Helper";
import { TextAnalysisProperty } from "../Type/TextAnalysisProperty";
import { ParamIdValidator } from "../Validator/Validator";
import { TextProcessAction } from "../Action/TextProcessAction";
import { TextAnalysisProcessAction } from "../Action/TextAnalysisProcessAction";
import { AuthMiddleware } from "../Middleware/AuthMiddleware";
import { AccessMiddleware } from "../Middleware/AccessMiddleware";
import { UserAuthProcessAction } from "../Action/UserAuthProcessAction";

export default class TextAnalysisController extends Controller {
  async countWord(
    req: Request<any, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req);
      const response = await new TextAnalysisProcessAction().getAnalysisReport(id, loggedInUser, TextAnalysisProperty.WORD_COUNT);
      res.json({ response });
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async countCharacter(
    req: Request<any, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req);
      const response = await new TextAnalysisProcessAction().getAnalysisReport(id, loggedInUser, TextAnalysisProperty.CHARACTER_COUNT);
      res.json({ response });
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async countSentence(
    req: Request<any, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req);
      const response = await new TextAnalysisProcessAction().getAnalysisReport(id, loggedInUser, TextAnalysisProperty.SENTENCE_COUNT);
      res.json({ response });
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async countParagraph(
    req: Request<any, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req);
      const response = await new TextAnalysisProcessAction().getAnalysisReport(id, loggedInUser, TextAnalysisProperty.PARAGRAPH_COUNT);
      res.json({ response });
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async longestWord(
    req: Request<any, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req);
      const response = await new TextAnalysisProcessAction().getAnalysisReport(id, loggedInUser, TextAnalysisProperty.lONGEST_WORD);
      res.json({ response });
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async singleContentFullDetails(
    req: Request<any, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req);
      const response = await new TextProcessAction().findTextById(id, loggedInUser);
      res.json(response);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async allContentFullDetails(
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await new TextProcessAction().listOfText();
      res.json(response);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  register() {
    
    /*
    Here param id means TextModel id property
   */
    this.router.use(AuthMiddleware);  
    this.router.get("/word-count/:id", [ParamIdValidator], this.countWord.bind(this));
    this.router.get("/character-count/:id", [ParamIdValidator], this.countCharacter.bind(this));
    this.router.get("/sentence-count/:id", [ParamIdValidator], this.countSentence.bind(this));
    this.router.get("/paragraph-count/:id", [ParamIdValidator], this.countParagraph.bind(this));
    this.router.get("/longest-word/:id", [ParamIdValidator], this.longestWord.bind(this));
    this.router.get("/find/:id", [ParamIdValidator], this.singleContentFullDetails.bind(this));
   /*  
    only admin can see all text full analysis report
   */
    this.router.use(AccessMiddleware('admin'));
    this.router.get("/all", this.allContentFullDetails.bind(this));
    return this.router;
  }
}
