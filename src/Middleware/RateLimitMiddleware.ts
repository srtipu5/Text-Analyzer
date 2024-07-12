import rateLimit from 'express-rate-limit';
export const RateLimiterMiddleware = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 40, // Limit each IP to 40 requests per `window` (here, per 1 minutes)
    message: 'Too many requests from this IP, please try again later.'
  });