import { body, param } from 'express-validator'
import { ValidatorMiddleware } from '../Middleware/ValidatorMiddleware';

export const TextValidator = ValidatorMiddleware([
    body('content')
    .isString().withMessage('Content must be a string')
    .notEmpty().withMessage('Content cannot be empty')
    .isLength({ min: 3 }).withMessage('Content must be at least 3 characters long')
    .trim()
])

export const ParamIdValidator = ValidatorMiddleware([
    param('id')
    .isInt().withMessage('ID must be an integer')
    .toInt(),
])