import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { AppError, handleError } from '../Util/Exception'
import UserController from "../Controller/UserController";
import TextController from "../Controller/TextController";
import TextAnalysisController from "../Controller/TextAnalysisController";
import AuthController from "../Controller/AuthController";
import { RateLimiterMiddleware } from "../Middleware/RateLimitMiddleware";

const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

// Apply the rate limiter to all routes
app.use(RateLimiterMiddleware);

app.use("/auth", new AuthController().register());
app.use("/user", new UserController().register());
app.use("/text", new TextController().register());
app.use("/analysis", new TextAnalysisController().register());

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res)
})

export default app;
