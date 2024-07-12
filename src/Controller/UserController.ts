import Controller from "./Controller";
import { NextFunction, Request, Response } from "express";
import { log, successApiResponse } from "../Util/Helper";
import {
  UserRegisterParams,
  UserUpdateParams,
  UserSearchParams,
} from "../Type/Request";
import {
  UserValidator,
  UpdateUserValidator,
  EmailValidator,
  ParamIdValidator,
} from "../Validator/Validator";
import { UserProcessAction } from "../Action/UserProcessAction";
import { AuthMiddleware } from "../Middleware/AuthMiddleware";
import { AccessMiddleware } from "../Middleware/AccessMiddleware";
import { UserAuthProcessAction } from "../Action/UserAuthProcessAction";
import { AppError } from "../Util/Exception";

export default class UserController extends Controller {
  async create(
    req: Request<unknown, unknown, UserRegisterParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const savedUser = await new UserProcessAction().saveUser(req.body as UserRegisterParams);
      res.json(successApiResponse("User successfully registered", savedUser));
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
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req); 
      if(id !== loggedInUser.id && loggedInUser.role !== 'admin'){
        throw new AppError(403, "You don't have access");
      }
      const updatedUser = await new UserProcessAction().updateUser(id, password);
      res.json(successApiResponse("User successfully updated", updatedUser));
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
      if(id !== loggedInUser.id && loggedInUser.role !== 'admin'){
        throw new AppError(403, "You don't have access");
      }
      const deletedUser = await new UserProcessAction().deleteUser(id);
      res.json(successApiResponse("User successfully deleted", deletedUser));
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
      res.json(successApiResponse("User successfully fetched", users));
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
      res.json(successApiResponse("User successfully fetched", user));
    } catch (error) {
      log(error);
      next(error);
    }
  }

  register() {
    this.router.post("/register", [UserValidator], this.create.bind(this)); // public route
    
    this.router.use(AuthMiddleware);
    this.router.post("/update/:id", [ParamIdValidator], [UpdateUserValidator], this.update.bind(this));
    this.router.get("/delete/:id", [ParamIdValidator], this.delete.bind(this));
    
    this.router.use(AccessMiddleware('admin'));
    this.router.get("/list", this.list.bind(this));
    this.router.post("/find-by-email",[EmailValidator], this.findByEmail.bind(this));

    return this.router;
  }
}
