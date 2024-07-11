import bcrypt from 'bcrypt';
import { save } from '../../../Database/Repository/UserRepository';
import { log } from '../../../Util/Helper';
import { UserRegisterParams } from '../../../Type/Request';
import { saveUser } from '../../../Action/User/SaveUser';

jest.mock('bcrypt');
jest.mock('../../../Database/Repository/UserRepository');
jest.mock('../../../Util/Helper');

describe('saveUser', () => {
  const reqUser: UserRegisterParams = { email: 'test1@gmail.com', password: 'password1' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when user is saved successfully', async () => {
    const mockHashedPassword = 'hashedPassword';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
    (save as jest.Mock).mockResolvedValue(true);

    const result = await saveUser(reqUser);

    expect(result).toBe(true);
    expect(bcrypt.hash).toHaveBeenCalledWith(reqUser.password, 10);
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ email: reqUser.email, password: mockHashedPassword }));
    expect(log).not.toHaveBeenCalled();
  });

  it('should return false and log the error when bcrypt.hash throws an error', async () => {
    const error = new Error('Bcrypt error');
    (bcrypt.hash as jest.Mock).mockRejectedValue(error);

    const result = await saveUser(reqUser);

    expect(result).toBe(false);
    expect(bcrypt.hash).toHaveBeenCalledWith(reqUser.password, 10);
    expect(save).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(error);
  });

  it('should return false and log the error when save throws an error', async () => {
    const mockHashedPassword = 'hashedPassword';
    const error = new Error('Database error');
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
    (save as jest.Mock).mockRejectedValue(error);

    const result = await saveUser(reqUser);

    expect(result).toBe(false);
    expect(bcrypt.hash).toHaveBeenCalledWith(reqUser.password, 10);
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ email: reqUser.email, password: mockHashedPassword }));
    expect(log).toHaveBeenCalledWith(error);
  });
});
