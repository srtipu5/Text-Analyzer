import { body, param } from 'express-validator'
import { ValidatorMiddleware } from '../Middleware/ValidatorMiddleware';

export const UserValidator = ValidatorMiddleware([
    body('email')
    .isEmail().withMessage('Invalid email format')
    .notEmpty().withMessage('Email cannot be empty')
    .trim(),
    body('password')
    .isString().withMessage('Password must be a string')
    .notEmpty().withMessage('Password cannot be empty')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    .trim(),
])

export const UpdateUserValidator = ValidatorMiddleware([
    body('password')
    .isString().withMessage('Password must be a string')
    .notEmpty().withMessage('Password cannot be empty')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    .trim(),
])

export const EmailValidator = ValidatorMiddleware([
    body('email')
    .isEmail().withMessage('Invalid email format')
    .notEmpty().withMessage('Email cannot be empty')
    .trim()
])

export const TextValidator = ValidatorMiddleware([
    body('content')
    .isString().withMessage('Content must be a string')
    .notEmpty().withMessage('Content cannot be empty')
    .isLength({ min: 3 }).withMessage('Content must be at least 3 characters long')
    .trim()
])

export const BodyIdValidator = ValidatorMiddleware([
    body('id')
    .isInt().withMessage('ID must be an integer')
    .toInt(),
])

export const ParamIdValidator = ValidatorMiddleware([
    param('id')
    .isInt().withMessage('ID must be an integer')
    .toInt(),
])


export const TokenValidator = ValidatorMiddleware([
    body('refreshToken')
    .isString().withMessage('Refresh Token must be a string')
    .notEmpty().withMessage('Refresh Token cannot be empty')
    .trim()
])