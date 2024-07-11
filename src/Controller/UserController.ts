import Controller from "./Controller";
import { NextFunction, Request, Response } from "express";
import { log } from "../Util/Helper";
import { UserRegisterParams, UserUpdateParams, UserSearchParams } from "../Type/Request";
import { UserValidator, UpdateUserValidator, EmailValidator, ParamIdValidator } from "../Validator/Validator";
import { UserProcessAction } from "../Action/UserProcessAction";

export default class UserController extends Controller {
  async create(
    req: Request<unknown, unknown, UserRegisterParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const isCreate = await new UserProcessAction().saveUser(req.body as UserRegisterParams);
      res.json(isCreate);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async update(
    req: Request<any, unknown, UserUpdateParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { password } = req.body;
      const isUpdate = await new UserProcessAction().updateUser(id, password);
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
      const isDelete = await new UserProcessAction().deleteUser(id);
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
      const users = await new UserProcessAction().listOfUser();
      res.json(users);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async findByEmail(
    req: Request<unknown, unknown, UserSearchParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      const user = await new UserProcessAction().findUserByEmail(email);
      res.json(user);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  register() {
    this.router.post("/register", [UserValidator], this.create.bind(this));
    this.router.post("/update/:id", [ParamIdValidator], [UpdateUserValidator], this.update.bind(this));
    this.router.get("/delete/:id", [ParamIdValidator], this.delete.bind(this));
    this.router.get("/list", this.list.bind(this));
    this.router.post("/find-by-email", [EmailValidator], this.findByEmail.bind(this));
    return this.router;
  }
}
