import { findUserById } from '../../../Action/User/FindUserById';
import { UserModel } from '../../../Database/Model/UserModel';
import { findById } from '../../../Database/Repository/UserRepository';
import { log } from '../../../Util/Helper';

jest.mock('../../../Database/Repository/UserRepository');
jest.mock('../../../Util/Helper');

describe('findUserById', () => {
  const mockUser: UserModel = { id: 1, email: 'test1@gmail.com' } as UserModel;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user when findById is successful', async () => {
    (findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await findUserById(1);

    expect(result).toEqual(mockUser);
    expect(findById).toHaveBeenCalledWith(1);
    expect(log).not.toHaveBeenCalled();
  });

  it('should return null and log the error when findById throws an error', async () => {
    const error = new Error('Database error');
    (findById as jest.Mock).mockRejectedValue(error);

    const result = await findUserById(1);

    expect(result).toBeNull();
    expect(findById).toHaveBeenCalledWith(1);
    expect(log).toHaveBeenCalledWith(error);
  });

  it('should return null when user is not found', async () => {
    (findById as jest.Mock).mockResolvedValue(null);

    const result = await findUserById(1);

    expect(result).toBeNull();
    expect(findById).toHaveBeenCalledWith(1);
    expect(log).not.toHaveBeenCalled();
  });
});
