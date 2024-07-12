import { Request, Response, NextFunction } from 'express';
import { UserAuthProcessAction } from '../Action/UserAuthProcessAction';
import { errorApiResponse } from '../Util/Helper';

export const AccessMiddleware = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedInUser = new UserAuthProcessAction().getLoggedInUserDetails(req);

      if (!loggedInUser || loggedInUser.role !== role) {
        return res.status(403).json(errorApiResponse("You don't have access"));
      }

      next();
    } catch (error) {
      return res.status(401).json(errorApiResponse("Unauthorized"));
    }
  };
};
