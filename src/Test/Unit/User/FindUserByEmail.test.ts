
import { findUserByEmail } from '../../../Action/User/FindUserByEmail';
import { UserModel } from '../../../Database/Model/UserModel';
import {findByEmail } from '../../../Database/Repository/UserRepository';
import { log } from '../../../Util/Helper';

jest.mock('../../../Database/Repository/UserRepository');
jest.mock('../../../Util/Helper');

describe('findUserByEmail', () => {
  const mockUser: UserModel = { id: 1, email: 'test1@gmail.com' } as UserModel;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user when findByEmail is successful', async () => {
    (findByEmail as jest.Mock).mockResolvedValue(mockUser);

    const result = await findUserByEmail('test1@gmail.com');

    expect(result).toEqual(mockUser);
    expect(findByEmail).toHaveBeenCalledWith('test1@gmail.com');
    expect(log).not.toHaveBeenCalled();
  });

  it('should return null and log the error when findByEmail throws an error', async () => {
    const error = new Error('Database error');
    (findByEmail as jest.Mock).mockRejectedValue(error);

    const result = await findUserByEmail('test1@gmail.com');

    expect(result).toBeNull();
    expect(findByEmail).toHaveBeenCalledWith('test1@gmail.com');
    expect(log).toHaveBeenCalledWith(error);
  });

  it('should return null when user is not found', async () => {
    (findByEmail as jest.Mock).mockResolvedValue(null);

    const result = await findUserByEmail('test1@gmail.com');

    expect(result).toBeNull();
    expect(findByEmail).toHaveBeenCalledWith('test1@gmail.com');
    expect(log).not.toHaveBeenCalled();
  });
});
