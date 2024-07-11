import bcrypt from 'bcrypt';
import { updatePassword } from '../../../Database/Repository/UserRepository';
import { log } from '../../../Util/Helper';
import { updateUser } from '../../../Action/User/UserUpdate';

jest.mock('bcrypt');
jest.mock('../../../Database/Repository/UserRepository');
jest.mock('../../../Util/Helper');

describe('updateUser', () => {
  const userId = 1;
  const reqPassword = 'newPassword';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when password is updated successfully', async () => {
    const mockHashedPassword = 'hashedPassword';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
    (updatePassword as jest.Mock).mockResolvedValue(true);

    const result = await updateUser(userId, reqPassword);

    expect(result).toBe(true);
    expect(bcrypt.hash).toHaveBeenCalledWith(reqPassword, 10);
    expect(updatePassword).toHaveBeenCalledWith(userId, mockHashedPassword);
    expect(log).not.toHaveBeenCalled();
  });

  it('should return false and log the error when bcrypt.hash throws an error', async () => {
    const error = new Error('Bcrypt error');
    (bcrypt.hash as jest.Mock).mockRejectedValue(error);

    const result = await updateUser(userId, reqPassword);

    expect(result).toBe(false);
    expect(bcrypt.hash).toHaveBeenCalledWith(reqPassword, 10);
    expect(updatePassword).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(error);
  });

  it('should return false and log the error when updatePassword throws an error', async () => {
    const mockHashedPassword = 'hashedPassword';
    const error = new Error('Database error');
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
    (updatePassword as jest.Mock).mockRejectedValue(error);

    const result = await updateUser(userId, reqPassword);

    expect(result).toBe(false);
    expect(bcrypt.hash).toHaveBeenCalledWith(reqPassword, 10);
    expect(updatePassword).toHaveBeenCalledWith(userId, mockHashedPassword);
    expect(log).toHaveBeenCalledWith(error);
  });
});
