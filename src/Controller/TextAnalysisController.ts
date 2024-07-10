import Controller from "./Controller";
import { NextFunction, Request, Response } from "express";
import { log } from "../Util/Helper";
import { ParamIdValidator } from "../Validator/TextValidator";
import { getAnalysisResult } from "../Action/Text/TextAnalysis";
import { TextAnalysisProperty } from "../Util/TextAnalysisProperty";
import { findTextById } from "../Action/Text/FindTextById";

export default class TextAnalysisController extends Controller {
  async countWord(
    req: Request<any, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const wordCount = await getAnalysisResult(id, TextAnalysisProperty.WORD_COUNT);
      res.json({ wordCount });
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
      const characterCount = await getAnalysisResult(id, TextAnalysisProperty.CHARACTER_COUNT);
      res.json({ characterCount });
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
      const sentenceCount = await getAnalysisResult(id, TextAnalysisProperty.SENTENCE_COUNT);
      res.json({ sentenceCount });
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
      const paragraphCount = await getAnalysisResult(id, TextAnalysisProperty.PARAGRAPH_COUNT);
      res.json({ paragraphCount });
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
      const longestWord = await getAnalysisResult(id, TextAnalysisProperty.lONGEST_WORD);
      res.json({ longestWord });
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async findFullDetails(
    req: Request<any, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const text = await findTextById(id);
      res.json(text);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  register() {
    
    /*
    Here param id means TextModel id property
   */
    
    this.router.get("/word-count/:id", [ParamIdValidator], this.countWord.bind(this));
    this.router.get("/character-count/:id", [ParamIdValidator], this.countCharacter.bind(this));
    this.router.get("/sentence-count/:id", [ParamIdValidator], this.countSentence.bind(this));
    this.router.get("/paragraph-count/:id", [ParamIdValidator], this.countParagraph.bind(this));
    this.router.get("/longest-word/:id", [ParamIdValidator], this.longestWord.bind(this));
    this.router.get("/find/:id", [ParamIdValidator], this.findFullDetails.bind(this));

    return this.router;
  }
}
