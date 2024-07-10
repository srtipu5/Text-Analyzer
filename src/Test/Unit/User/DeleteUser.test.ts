
import { deleteUser } from '../../../Action/User/DeleteUser';
import { deleteById } from '../../../Database/Repository/UserRepository';
import { log } from '../../../Util/Helper';

jest.mock('../../../Database/Repository/UserRepository');
jest.mock('../../../Util/Helper');

describe('deleteUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when deleteById is successful', async () => {
    (deleteById as jest.Mock).mockResolvedValue(true);

    const result = await deleteUser(1);

    expect(result).toBe(true);
    expect(deleteById).toHaveBeenCalledWith(1);
    expect(log).not.toHaveBeenCalled();
  });

  it('should return false and log the error when deleteById throws an error', async () => {
    const error = new Error('Database error');
    (deleteById as jest.Mock).mockRejectedValue(error);

    const result = await deleteUser(1);

    expect(result).toBe(false);
    expect(deleteById).toHaveBeenCalledWith(1);
    expect(log).toHaveBeenCalledWith(error);
  });

  it('should return false when deleteById returns false', async () => {
    (deleteById as jest.Mock).mockResolvedValue(false);

    const result = await deleteUser(1);

    expect(result).toBe(false);
    expect(deleteById).toHaveBeenCalledWith(1);
    expect(log).not.toHaveBeenCalled();
  });
});
