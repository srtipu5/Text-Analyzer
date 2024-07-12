import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { UserAuthProcessAction } from '../../Action/UserAuthProcessAction';
import { UserModel } from '../../Database/Model/UserModel';
import { AppError } from '../../Util/Exception';


jest.mock('jsonwebtoken');

describe('UserAuthProcessAction', () => {
  let userAuthProcessAction: UserAuthProcessAction;

  beforeEach(() => {
    userAuthProcessAction = new UserAuthProcessAction();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buildPayload', () => {
    it('should return the user model as payload', () => {
      const user: UserModel = { id: 1, email: 'test@example.com', password: 'password123' } as UserModel;
      const payload = userAuthProcessAction.buildPayload(user);
      expect(payload).toEqual(user);
    });
  });

  describe('getToken', () => {
    it('should return a JWT token', () => {
      const user: UserModel = { id: 1, email: 'test@example.com', password: 'password123' } as UserModel;
      const token = 'token';
      const jwtSecret = 'secret';
      
      process.env.JWT_SECRET = jwtSecret;
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = userAuthProcessAction.getToken(user);

      expect(result).toEqual(token);
      expect(jwt.sign).toHaveBeenCalledWith(user, jwtSecret, { expiresIn: 30 * 60  }); // 30 minutes
    });
  });

  describe('getLoggedInUserDetails', () => {
    it('should return user details from a valid token', () => {
      const token = 'token';
      const user: UserModel = { id: 1, email: 'test@example.com', password: 'password123' } as UserModel;
      const req = { headers: { authorization: `Bearer ${token}` } } as IncomingMessage;
      const jwtSecret = 'secret';

      process.env.JWT_SECRET = jwtSecret;
      (jwt.verify as jest.Mock).mockReturnValue(user);

      const result = userAuthProcessAction.getLoggedInUserDetails(req);

      expect(result).toEqual(user);
      expect(jwt.verify).toHaveBeenCalledWith(token, jwtSecret);
    });

    it('should throw an error if authorization header is missing', () => {
      const req = { headers: {} } as IncomingMessage;

      expect(() => userAuthProcessAction.getLoggedInUserDetails(req)).toThrow(AppError);
    });

    it('should throw an error if token is missing', () => {
      const req = { headers: { authorization: 'Bearer ' } } as IncomingMessage;

      expect(() => userAuthProcessAction.getLoggedInUserDetails(req)).toThrow(AppError);
    });

    it('should throw an error if token is invalid or expired', () => {
      const token = 'token';
      const req = { headers: { authorization: `Bearer ${token}` } } as IncomingMessage;
      const jwtSecret = 'secret';

      process.env.JWT_SECRET = jwtSecret;
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });

      expect(() => userAuthProcessAction.getLoggedInUserDetails(req)).toThrow(AppError);
    });
  });

  describe('getJwtSecret', () => {
    it('should return the JWT secret from environment variables', () => {
      const jwtSecret = 'secret';
      process.env.JWT_SECRET = jwtSecret;

      const result = userAuthProcessAction['getJwtSecret']();

      expect(result).toEqual(jwtSecret);
    });

    it('should throw an error if JWT secret is not defined', () => {
      delete process.env.JWT_SECRET;

      expect(() => userAuthProcessAction['getJwtSecret']()).toThrow(AppError);
    });
  });

  describe('extractToken', () => {
    it('should return the token from the authorization header', () => {
      const token = 'token';
      const req = { headers: { authorization: `Bearer ${token}` } } as IncomingMessage;

      const result = userAuthProcessAction['extractToken'](req);

      expect(result).toEqual(token);
    });

    it('should throw an error if authorization header is missing', () => {
      const req = { headers: {} } as IncomingMessage;

      expect(() => userAuthProcessAction['extractToken'](req)).toThrow(AppError);
    });

    it('should throw an error if token is missing', () => {
      const req = { headers: { authorization: 'Bearer ' } } as IncomingMessage;

      expect(() => userAuthProcessAction['extractToken'](req)).toThrow(AppError);
    });
  });

  describe('verifyToken', () => {
    it('should return the user model from a valid token', () => {
      const token = 'token';
      const user: UserModel = { id: 1, email: 'test@example.com', password: 'password123' } as UserModel;
      const jwtSecret = 'secret';

      process.env.JWT_SECRET = jwtSecret;
      (jwt.verify as jest.Mock).mockReturnValue(user);

      const result = userAuthProcessAction['verifyToken'](token);

      expect(result).toEqual(user);
      expect(jwt.verify).toHaveBeenCalledWith(token, jwtSecret);
    });

    it('should throw an error if token is invalid or expired', () => {
      const token = 'token';
      const jwtSecret = 'secret';

      process.env.JWT_SECRET = jwtSecret;
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });

      expect(() => userAuthProcessAction['verifyToken'](token)).toThrow(AppError);
    });
  });
});
