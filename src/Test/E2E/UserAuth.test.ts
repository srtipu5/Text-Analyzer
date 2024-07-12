import request from 'supertest';
import express, { Application } from 'express';
import AuthController from '../../Controller/AuthController';
import { UserModel } from '../../Database/Model/UserModel';
import { UserRepo } from '../../Database/Repository/UserRepo';
import CacheService from '../../Service/CacheService';
import { comparePassword } from '../../Util/Helper';
import { UserAuthProcessAction } from '../../Action/UserAuthProcessAction';

jest.mock('../../Database/Repository/UserRepo');
jest.mock('../../Service/CacheService');
jest.mock('../../Util/Helper');
jest.mock('../../Action/UserAuthProcessAction');

const app: Application = express();
app.use(express.json());
app.use('/auth', new AuthController().register());

describe('AuthController E2E Tests', () => {
  const mockUser: UserModel = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword123',
  } as UserModel;

  const mockToken = 'mocktoken';
  const mockRefreshToken = 'mockrefreshtoken';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should login a user and return tokens', async () => {
      (UserRepo.prototype.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (UserAuthProcessAction.prototype.getToken as jest.Mock).mockReturnValue(mockToken);
      jest.spyOn(CacheService, 'set').mockReturnValue(true);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: mockToken,
        refreshToken: expect.any(String),
      });
      expect(CacheService.set).toHaveBeenCalledWith(`user:${mockUser.id}`, mockUser, 30);
      expect(CacheService.set).toHaveBeenCalledWith(expect.any(String), mockUser, 24 * 60);
    });

    it('should return error if user is not found', async () => {
      (UserRepo.prototype.findByEmail as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'User not found' });
    });

    it('should return error if password is incorrect', async () => {
      (UserRepo.prototype.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Email or Password is incorrect' });
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token', async () => {
      jest.spyOn(CacheService, 'get').mockReturnValue(mockUser);
      (UserAuthProcessAction.prototype.getToken as jest.Mock).mockReturnValue(mockToken);

      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: mockRefreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: mockToken });
    });

    it('should return error if refresh token is invalid', async () => {
      jest.spyOn(CacheService, 'get').mockReturnValue(null);

      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: mockRefreshToken });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: `User not found with refresh token: ${mockRefreshToken}` });
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout a user', async () => {
      const mockReq = { headers: { authorization: `Bearer ${mockToken}` } };
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      jest.spyOn(CacheService, 'del').mockReturnValue(1);

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Logout successful' });
      expect(CacheService.del).toHaveBeenCalledWith(`user:${mockUser.id}`);
    });

    it('should return error if user is not logged in', async () => {
      const mockReq = { headers: { authorization: `Bearer ${mockToken}` } };
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(null);

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Not logged in' });
    });
  });
});
