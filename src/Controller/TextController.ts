import Controller from "./Controller";
import { NextFunction, Request, Response } from "express";
import { log } from "../Util/Helper";
import { TextRegisterParams, UserIdParams } from "../Request/ReqParams";
import { UserIdValidator } from "../Validator/UserValidator";
import { ParamIdValidator, TextValidator } from "../Validator/TextValidator";
import { saveText } from "../Action/Text/SaveText";
import { updateText } from "../Action/Text/UpdateText";
import { deleteText } from "../Action/Text/DeleteText";
import { listOfTexts } from "../Action/Text/ListOfTexts";
import { findTextByUserId } from "../Action/Text/FindTextByUserId";


export default class TextController extends Controller {
  async create(
    req: Request<unknown, unknown, TextRegisterParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { content } = req.body;
      const userId = 1;
      const isCreate = await saveText(content, userId) // userid will manage from login
      res.json(isCreate);
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
      const texts = await listOfTexts();
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
      const texts = await findTextByUserId(userId);
      res.json(texts);
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
      const { content } = req.body;
      const { id } = req.params;
      const userId = 1;
      const isUpdate = await updateText(id, content, userId);
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
      const isDelete = await deleteText(id);
      res.json(isDelete);
    } catch (error) {
      log(error);
      next(error);
    }
  }


  register() {
    this.router.post("/create", [TextValidator], this.create.bind(this));
    this.router.post("/update/:id", [ParamIdValidator], this.update.bind(this));
    this.router.get("/delete/:id", [ParamIdValidator], this.delete.bind(this));
    this.router.get("/list", this.list.bind(this));
    
    this.router.post("/userId", [UserIdValidator], this.findByUserId.bind(this));
    return this.router;
  }
}
