import { NextFunction, Request, Response } from "express";
import Controller from "./Controller";
import { comparePassword, errorApiResponse, getRefreshTokenKey, getUserKey, log, successApiResponse } from "../Util/Helper";
import { UserAuthParams } from "../Type/Request";
import { TokenValidator, UserValidator } from "../Validator/Validator";
import { UserAuthProcessAction } from "../Action/UserAuthProcessAction";
import { UserRepo } from "../Database/Repository/UserRepo";
import CacheService from "../Service/CacheService";
import { AuthMiddleware } from "../Middleware/AuthMiddleware";

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
        throw new Error("Email or Password is incorrect");
      }

      const payload = new UserAuthProcessAction().buildPayload(user);

      const token = new UserAuthProcessAction().getToken(payload);

      CacheService.set(getUserKey(user.id), user, 30);  // user cached

      const refreshTokenKey = getRefreshTokenKey();
      CacheService.set(refreshTokenKey, payload, 24*60);  // user token cached
      res.json({ token, refreshToken: refreshTokenKey });
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
      const cachedUser = CacheService.get(req.body.refreshToken);
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

  async logout(
    req: Request<unknown, unknown, any, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req); 

      if(!loggedInUser){
        res.status(401).json(errorApiResponse('Not logged in'));
      }
      
      CacheService.del(getUserKey(loggedInUser.id));
      res.status(401).json(successApiResponse('Logout successful'));
    } catch (error) {
      log(error);
      next(error);
    }
  }

  register() {
    this.router.post("/login", [UserValidator], this.login.bind(this));
    this.router.post("/refresh", [TokenValidator], this.refresh.bind(this));
    this.router.use(AuthMiddleware);
    this.router.post("/logout", this.logout.bind(this));
    return this.router;
  }
}
