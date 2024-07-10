import { Response } from 'express'

export class AppError extends Error {
  statusCode: number
  message: string

  constructor(statusCode: number, message: string) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

export const handleError = (err: AppError, res: Response) => {
  const { statusCode = 400, message } = err
  res.status(statusCode).json({ message })
}