import request from 'supertest';
import express, { Application } from 'express';
import UserController from '../../Controller/UserController';
import { UserAuthProcessAction } from '../../Action/UserAuthProcessAction';
import { UserProcessAction } from '../../Action/UserProcessAction';
import { AuthMiddleware } from '../../Middleware/AuthMiddleware';
import { AccessMiddleware } from '../../Middleware/AccessMiddleware';
import { log, successApiResponse } from '../../Util/Helper';
import { UserModel } from '../../Database/Model/UserModel';

jest.mock('../../Action/UserAuthProcessAction');
jest.mock('../../Action/UserProcessAction');
jest.mock('../../Middleware/AuthMiddleware');
jest.mock('../../Middleware/AccessMiddleware');
jest.mock('../../Util/Helper');

const app: Application = express();
app.use(express.json());
app.use('/user', new UserController().register());

describe('UserController E2E Tests', () => {
  const mockUser: UserModel = {
    id: 1,
    email: 'srtipu6@gmail.com',
    password: 'hashedpassword123',
    role: 'user'
  } as UserModel;

  const mockAdmin: UserModel = {
    id: 2,
    email: 'srtipu5@gmail.com',
    password: 'hashedpassword123',
    role: 'admin'
  } as UserModel;

  beforeEach(() => {
    jest.clearAllMocks();
    (AuthMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
    (AccessMiddleware as jest.Mock).mockImplementation(() => (req: any, res: any, next: any) => next());
  });

  describe('POST /user/register', () => {
    it('should register a user', async () => {
      const newUser = { email: 'newuser@example.com', password: 'password123' };
      (UserProcessAction.prototype.saveUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/user/register').send(newUser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(successApiResponse("User successfully registered", mockUser));
    });
  });

  describe('POST /user/update/:id', () => {
    it('should update a user', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      (UserProcessAction.prototype.updateUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/user/update/1').send({ password: 'newpassword123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(successApiResponse("User successfully updated", mockUser));
    });

    it('should deny update for non-admin trying to update other user', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);

      const response = await request(app).post('/user/update/2').send({ password: 'newpassword123' });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /user/delete/:id', () => {
    it('should delete a user', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      (UserProcessAction.prototype.deleteUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get('/user/delete/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(successApiResponse("User successfully deleted", mockUser));
    });

    it('should deny deletion for non-admin trying to delete other user', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);

      const response = await request(app).get('/user/delete/2');

      expect(response.status).toBe(403);
    });
  });

  describe('GET /user/list', () => {
    it('should list all users', async () => {
      const users = [mockUser, mockAdmin];
      (UserProcessAction.prototype.listOfUser as jest.Mock).mockResolvedValue(users);

      const response = await request(app).get('/user/list');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(successApiResponse("User successfully fetched", users));
    });
  });

  describe('POST /user/find-by-email', () => {
    it('should find a user by email', async () => {
      (UserProcessAction.prototype.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/user/find-by-email').send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(successApiResponse("User successfully fetched", mockUser));
    });
  });
});
