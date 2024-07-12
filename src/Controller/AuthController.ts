import { uuid } from "licia";
import { NextFunction, Request, Response } from "express";
import Controller from "./Controller";
import { comparePassword, log } from "../Util/Helper";
import { UserAuthParams } from "../Type/Request";
import { TokenValidator, UserValidator } from "../Validator/Validator";
import { authCache } from "../Service/AuthCache";
import { UserAuthProcessAction } from "../Action/UserAuthProcessAction";
import { UserRepo } from "../Database/Repository/UserRepo";

export default class AuthController extends Controller {
  async login(
    req: Request<unknown, unknown, UserAuthParams, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;
      const user = await new UserRepo().findByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      if (!(await comparePassword(password, user.password))) {
        throw new Error("Password is incorrect");
      }

      const payload = new UserAuthProcessAction().buildPayload(user);

      const token = new UserAuthProcessAction().getToken(payload);

      const refreshToken = uuid();
      authCache.set(refreshToken, payload);
      res.json({ token, refreshToken: refreshToken });
    } catch (error) {
      log(error);
      next(error);
    }
  }

  async refresh(
    req: Request<unknown, unknown, any, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cachedUser = authCache.get(req.body.refreshToken);
      if (!cachedUser) {
        throw new Error(
          `User not found with refresh token: ${req.body.refreshToken}`
        );
      }

      const token = new UserAuthProcessAction().getToken(cachedUser);

      res.json({ token });
    } catch (error) {
      log(error);
      next(error);
    }
  }

  register() {
    this.router.post("/login", [UserValidator], this.login.bind(this));
    this.router.post("/refresh", [TokenValidator], this.refresh.bind(this));
    return this.router;
  }
}
