import Controller from "./Controller";
import { NextFunction, Request, Response } from "express";
import { log } from "../Util/Helper";
import { TextRegisterParams, UserIdParams } from "../Type/Request";
import { BodyIdValidator, ParamIdValidator, TextValidator } from "../Validator/Validator";
import { TextProcessAction } from "../Action/TextProcessAction";


export default class TextController extends Controller {
  async create(
    req: Request<unknown, unknown, TextRegisterParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { content } = req.body;
      const userId = 1;
      const isCreate = await new TextProcessAction().saveText(content, userId) // userid will manage from login
      res.json(isCreate);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async update(
    req: Request<any, unknown, TextRegisterParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = 1;
      const isUpdate = await new TextProcessAction().updateText(id, content, userId);
      res.json(isUpdate);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async delete(
    req: Request<any, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const isDelete = await new TextProcessAction().deleteText(id);
      res.json(isDelete);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async list(
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const texts = await new TextProcessAction().listOfText();
      res.json(texts);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async findByUserId(
    req: Request<unknown, unknown, UserIdParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.body;
      const texts = await new TextProcessAction().findTextByUserId(userId);
      res.json(texts);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  register() {
    this.router.post("/create", [TextValidator], this.create.bind(this));
    this.router.post("/update/:id", [ParamIdValidator], [TextValidator], this.update.bind(this));
    this.router.get("/delete/:id", [ParamIdValidator], this.delete.bind(this));
    this.router.get("/list", this.list.bind(this));
    this.router.post("/userId", [BodyIdValidator], this.findByUserId.bind(this));
    return this.router;
  }
}
