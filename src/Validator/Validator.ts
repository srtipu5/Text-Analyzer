import { body, param } from 'express-validator';
import { ValidatorMiddleware } from '../Middleware/ValidatorMiddleware';

const emailValidator = body('email')
  .isEmail().withMessage('Invalid email format')
  .notEmpty().withMessage('Email cannot be empty')
  .trim();

const passwordValidator = body('password')
  .isString().withMessage('Password must be a string')
  .notEmpty().withMessage('Password cannot be empty')
  .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
  .trim();

const idBodyValidator = body('id')
  .isInt().withMessage('ID must be an integer')
  .toInt();

const idParamValidator = param('id')
  .isInt().withMessage('ID must be an integer')
  .toInt();

const contentValidator = body('content')
  .isString().withMessage('Content must be a string')
  .notEmpty().withMessage('Content cannot be empty')
  .isLength({ min: 3 }).withMessage('Content must be at least 3 characters long')
  .trim();

const tokenValidator = body('refreshToken')
  .isString().withMessage('Refresh Token must be a string')
  .notEmpty().withMessage('Refresh Token cannot be empty')
  .trim();

export const UserValidator = ValidatorMiddleware([emailValidator, passwordValidator]);

export const UpdateUserValidator = ValidatorMiddleware([passwordValidator]);

export const EmailValidator = ValidatorMiddleware([emailValidator]);

export const TextValidator = ValidatorMiddleware([contentValidator]);

export const BodyIdValidator = ValidatorMiddleware([idBodyValidator]);

export const ParamIdValidator = ValidatorMiddleware([idParamValidator]);

export const TokenValidator = ValidatorMiddleware([tokenValidator]);
