import { findAll } from '../../../Database/Repository/UserRepository';
import { log } from '../../../Util/Helper';
import { UserModel } from '../../../Database/Model/UserModel';
import { listOfUsers } from '../../../Action/User/ListOfUsers';

jest.mock('../../../Database/Repository/UserRepository');
jest.mock('../../../Util/Helper');

describe('listOfUsers', () => {
  const mockUsers: UserModel[] = [
    { id: 1, email: 'test1@gmail.com'} as UserModel,
    { id: 2, email: 'test2@gmail.com'} as UserModel,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of users when findAll is successful', async () => {
    (findAll as jest.Mock).mockResolvedValue(mockUsers);

    const result = await listOfUsers();

    expect(result).toEqual(mockUsers);
    expect(findAll).toHaveBeenCalledTimes(1);
    expect(log).not.toHaveBeenCalled();
  });

  it('should return null and log the error when findAll throws an error', async () => {
    const error = new Error('Database error');
    (findAll as jest.Mock).mockRejectedValue(error);

    const result = await listOfUsers();

    expect(result).toBeNull();
    expect(findAll).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(error);
  });

  it('should return null when user is not found', async () => {
    (findAll as jest.Mock).mockResolvedValue(null);

    const result = await listOfUsers();

    expect(result).toBeNull();
    expect(findAll).toHaveBeenCalledTimes(1);
    expect(log).not.toHaveBeenCalled();
  });
});
