import { body } from 'express-validator'
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


export const IdValidator = ValidatorMiddleware([
    body('id')
    .isInt().withMessage('ID must be an integer')
    .toInt(),
])

export const EmailValidator = ValidatorMiddleware([
    body('email')
    .isEmail().withMessage('Invalid email format')
    .notEmpty().withMessage('Email cannot be empty')
    .trim()
])


export const UserIdValidator = ValidatorMiddleware([
    body('userId')
    .isInt().withMessage('UserID must be an integer')
    .toInt(),
])


export const UserUpdateValidator = ValidatorMiddleware([
    body('id')
    .isInt().withMessage('ID must be an integer')
    .toInt(),
    body('password')
    .isString().withMessage('Password must be a string')
    .notEmpty().withMessage('Password cannot be empty')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    .trim(),
])

