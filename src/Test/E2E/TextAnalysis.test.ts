import request from 'supertest';
import express, { Application } from 'express';
import TextAnalysisController from '../../Controller/TextAnalysisController';
import { UserAuthProcessAction } from '../../Action/UserAuthProcessAction';
import { TextAnalysisProcessAction } from '../../Action/TextAnalysisProcessAction';
import { TextProcessAction } from '../../Action/TextProcessAction';
import { AuthMiddleware } from '../../Middleware/AuthMiddleware';
import { AccessMiddleware } from '../../Middleware/AccessMiddleware';
import { UserModel } from '../../Database/Model/UserModel';

jest.mock('../../Action/UserAuthProcessAction');
jest.mock('../../Action/TextAnalysisProcessAction');
jest.mock('../../Action/TextProcessAction');
jest.mock('../../Middleware/AuthMiddleware');
jest.mock('../../Middleware/AccessMiddleware');
jest.mock('../../Util/Helper');

const app: Application = express();
app.use(express.json());
app.use('/analysis', new TextAnalysisController().register());

describe('TextAnalysisController E2E Tests', () => {
  const mockUser: UserModel = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword123',
  } as UserModel;

  beforeEach(() => {
    jest.clearAllMocks();
    (AuthMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
    (AccessMiddleware as jest.Mock).mockImplementation(() => (req: any, res: any, next: any) => next());
  });

  describe('GET /analysis/word-count/:id', () => {
    it('should return word count', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      (TextAnalysisProcessAction.prototype.getAnalysisReport as jest.Mock).mockResolvedValue(100);

      const response = await request(app).get('/analysis/word-count/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ wordCount: 100 });
    });
  });

  describe('GET /analysis/character-count/:id', () => {
    it('should return character count', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      (TextAnalysisProcessAction.prototype.getAnalysisReport as jest.Mock).mockResolvedValue(500);

      const response = await request(app).get('/analysis/character-count/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ characterCount: 500 });
    });
  });

  describe('GET /analysis/sentence-count/:id', () => {
    it('should return sentence count', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      (TextAnalysisProcessAction.prototype.getAnalysisReport as jest.Mock).mockResolvedValue(20);

      const response = await request(app).get('/analysis/sentence-count/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ sentenceCount: 20 });
    });
  });

  describe('GET /analysis/paragraph-count/:id', () => {
    it('should return paragraph count', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      (TextAnalysisProcessAction.prototype.getAnalysisReport as jest.Mock).mockResolvedValue(5);

      const response = await request(app).get('/analysis/paragraph-count/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ paragraphCount: 5 });
    });
  });

  describe('GET /analysis/longest-word/:id', () => {
    it('should return longest word', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      (TextAnalysisProcessAction.prototype.getAnalysisReport as jest.Mock).mockResolvedValue('supercalifragilisticexpialidocious');

      const response = await request(app).get('/analysis/longest-word/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ longestWord: 'supercalifragilisticexpialidocious' });
    });
  });

  describe('GET /analysis/find/:id', () => {
    it('should return full details of single content', async () => {
      (UserAuthProcessAction.prototype.getLoggedInUserDetails as jest.Mock).mockReturnValue(mockUser);
      const mockText = { id: 1, content: 'Sample text' };
      (TextProcessAction.prototype.findTextById as jest.Mock).mockResolvedValue(mockText);

      const response = await request(app).get('/analysis/find/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockText);
    });
  });

  describe('GET /analysis/all', () => {
    it('should return full details of all content', async () => {
      const mockTexts = [{ id: 1, content: 'Sample text' }, { id: 2, content: 'Another sample text' }];
      (TextProcessAction.prototype.listOfText as jest.Mock).mockResolvedValue(mockTexts);

      const response = await request(app).get('/analysis/all');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTexts);
    });
  });
});
