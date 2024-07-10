import Controller from "./Controller";
import { NextFunction, Request, Response } from "express";
import { log } from "../Util/Helper";
import { UserRegisterParams, IdParams, EmailParams, UpdateParams } from "../Request/ReqParams";
import { UserValidator, IdValidator, EmailValidator, UserUpdateValidator } from "../Validator/UserValidator";
import { saveUser } from "../Action/User/SaveUser";
import { listOfUsers } from "../Action/User/ListOfUsers";
import { findUserById } from "../Action/User/FindUserById";
import { findUserByEmail } from "../Action/User/FindUserByEmail";
import { updateUser } from "../Action/User/UpdateUser";
import { deleteUser } from "../Action/User/DeleteUser";


export default class UserController extends Controller {
  async create(
    req: Request<unknown, unknown, UserRegisterParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const isCreate =  await saveUser(req.body as UserRegisterParams)
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
      const users = await listOfUsers();
      res.json(users);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async findByEmail(
    req: Request<unknown, unknown, EmailParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      const user = await findUserByEmail(email);
      res.json(user);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async findById(
    req: Request<unknown, unknown, IdParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.body;
      const user = await findUserById(id);
      res.json(user);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async update(
    req: Request<unknown, unknown, UpdateParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {

      const { id, password } = req.body;
      const isUpdate = await updateUser(id, password);
      res.json(isUpdate);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async delete(
    req: Request<IdParams, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const isDelete = await deleteUser(id);
      res.json(isDelete);
    } catch (error) {
      log(error);
      next(error);
    }
  }

  register() {
    this.router.post("/register", [UserValidator], this.create.bind(this));
    this.router.post("/update/:id", [UserUpdateValidator], this.update.bind(this));
    this.router.get("/delete/:id", this.delete.bind(this));
    this.router.get("/list", this.list.bind(this));
    
    this.router.post("/find-by-email", [EmailValidator], this.findByEmail.bind(this));
    this.router.post("/find-by-id", [IdValidator], this.findById.bind(this));
    return this.router;
  }
}
