import jwt from 'jsonwebtoken';
import { AuthBodyParams } from '../../../Request/Auth/AuthBodyParams';
import { authenticate } from '../../../Action/Auth/Authenticate';
import { AuthResponse } from '../../../Response/Auth/AuthResponse';


jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('testToken'),
}));

describe('Authentication Test', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); 
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv; 
  });

  it('should return a token for correct credentials', () => {
    process.env.JWT_SECRET = 'testSecret';
    const reqBody: AuthBodyParams = { username: 'testUsername', password: 'testPassword' };

    const response: AuthResponse = authenticate(reqBody);

    expect(response.success).toBe(true);
    expect(response.token).toBe('testToken');
    expect(jwt.sign).toHaveBeenCalledWith(
      { username: 'testUsername', password: 'testPassword' },
      'testSecret',
      { expiresIn: '1h' }
    );
  });

  it('should return 401 for incorrect credentials', () => {
    process.env.JWT_SECRET = 'testSecret';
    const reqBody: AuthBodyParams = { username: 'wrongUsername', password: 'wrongPassword' };

    const response: AuthResponse = authenticate(reqBody);

    expect(response.success).toBe(false);
    expect(response.errorCode).toBe(401);
  });

  it('should return 500 if JWT_SECRET is not defined', () => {
    delete process.env.JWT_SECRET;
    const reqBody: AuthBodyParams = { username: 'testUsername', password: 'testPassword' };

    const response: AuthResponse = authenticate(reqBody);

    expect(response.success).toBe(false);
    expect(response.errorCode).toBe(500);
  });

  it('should return 500 if an error occurs', () => {
    process.env.JWT_SECRET = 'testSecret';
    jest.spyOn(jwt, 'sign').mockImplementation(() => {
      throw new Error('Test Error');
    });
    const reqBody: AuthBodyParams = { username: 'testUsername', password: 'testPassword' };

    const response: AuthResponse = authenticate(reqBody);

    expect(response.success).toBe(false);
    expect(response.errorCode).toBe(500);
    jest.restoreAllMocks();
  });
});
