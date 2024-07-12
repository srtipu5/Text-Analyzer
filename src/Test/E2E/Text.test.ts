import request from 'supertest';
import express, { Application } from 'express';
import TextController from '../../Controller/TextController';
import { UserAuthProcessAction } from '../../Action/UserAuthProcessAction';
import { TextProcessAction } from '../../Action/TextProcessAction';
import { AuthMiddleware } from '../../Middleware/AuthMiddleware';
import { log, errorApiResponse } from '../../Util/Helper';
import { TextModel } from '../../Database/Model/TextModel';

jest.mock('../../Action/UserAuthProcessAction');
jest.mock('../../Action/TextProcessAction');
jest.mock('../../Middleware/AuthMiddleware');
jest.mock('../../Util/Helper');

const app: Application = express();
app.use(express.json());
app.use('/text', new TextController().register());

describe('TextController E2E Tests', () => {
  const mockUser = {
    id: 1,
    email: 'user@gmail.com',
    role: 'user'
  };

  const mockAdmin = {
    id: 2,
    email: 'admin@gmail.com',
    role: 'admin'
  };

  const mockText: TextModel = {
    id: 1,
    content: 'Sample text content',
    userId: 1
  } as TextModel;

  beforeEach(() => {
    jest.clearAllMocks();
    (AuthMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
  });

  describe('POST /text/create', () => {
    it('should create a text', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      (TextProcessAction.prototype.saveText as jest.Mock).mockResolvedValue(mockText);

      const response = await request(app).post('/text/create').send({ content: 'New text content' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockText);
    });
  });

  describe('POST /text/update/:id', () => {
    it('should update a text', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      (TextProcessAction.prototype.updateText as jest.Mock).mockResolvedValue(mockText);

      const response = await request(app).post('/text/update/1').send({ content: 'Updated text content' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockText);
    });
  });

  describe('GET /text/delete/:id', () => {
    it('should delete a text', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      (TextProcessAction.prototype.deleteText as jest.Mock).mockResolvedValue(mockText);

      const response = await request(app).get('/text/delete/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockText);
    });
  });

  describe('GET /text/list', () => {
    it('should list all texts', async () => {
      const texts = [mockText];
      (TextProcessAction.prototype.listOfText as jest.Mock).mockResolvedValue(texts);

      const response = await request(app).get('/text/list');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(texts);
    });
  });

  describe('POST /text/userId', () => {
    it('should find texts by user ID for the same user', async () => {
      const texts = [mockText];
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      (TextProcessAction.prototype.findTextByUserId as jest.Mock).mockResolvedValue(texts);

      const response = await request(app).post('/text/userId').send({ userId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(texts);
    });

    it('should find texts by user ID for admin', async () => {
      const texts = [mockText];
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockAdmin);
      (TextProcessAction.prototype.findTextByUserId as jest.Mock).mockResolvedValue(texts);

      const response = await request(app).post('/text/userId').send({ userId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(texts);
    });

    it('should return an error for unauthorized access', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);

      const response = await request(app).post('/text/userId').send({ userId: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(errorApiResponse("You don't have access"));
    });
  });
});
