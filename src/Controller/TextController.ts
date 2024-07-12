import Controller from "./Controller";
import { NextFunction, Request, Response } from "express";
import { errorApiResponse, log } from "../Util/Helper";
import { TextRegisterParams, UserIdParams } from "../Type/Request";
import { BodyIdValidator, ParamIdValidator, TextValidator } from "../Validator/Validator";
import { TextProcessAction } from "../Action/TextProcessAction";
import { AuthMiddleware } from "../Middleware/AuthMiddleware";
import { UserAuthProcessAction } from "../Action/UserAuthProcessAction";
import { TextRepo } from "../Database/Repository/TextRepo";


export default class TextController extends Controller {
  async create(
    req: Request<unknown, unknown, TextRegisterParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { content } = req.body;
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req); // loggedIn user details
      const response = await new TextProcessAction().saveText(content, loggedInUser) 
      res.json(response);
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
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req);
      const response = await new TextProcessAction().updateText(id, content, loggedInUser);
      res.json(response);
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
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req); 
      const response = await new TextProcessAction().deleteText(id, loggedInUser);
      res.json(response);
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
      const response = await new TextProcessAction().listOfText();
      res.json(response);
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
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req);
      if(userId !== loggedInUser.id && loggedInUser.role !== 'admin'){
        return res.json(errorApiResponse("You don't have access"));
      }
      const response = await new TextProcessAction().findTextByUserId(userId);
      res.json(response);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  register() {
    this.router.use(AuthMiddleware);
    this.router.post("/create", [TextValidator], this.create.bind(this));
    this.router.post("/update/:id", [ParamIdValidator], [TextValidator], this.update.bind(this));
    this.router.get("/delete/:id", [ParamIdValidator], this.delete.bind(this));
    this.router.get("/list", this.list.bind(this));
    this.router.post("/userId", [BodyIdValidator], this.findByUserId.bind(this));

    return this.router;
  }
}
