import { UserProcessAction } from "../../Action/UserProcessAction";
import { UserModel } from "../../Database/Model/UserModel";
import { UserRepo } from "../../Database/Repository/UserRepo";
import CacheService from "../../Service/CacheService";
import { UserRegisterParams } from "../../Type/Request";
import { AppError } from "../../Util/Exception";
import { hashPassword } from "../../Util/Helper";


jest.mock('../../Database/Repository/UserRepo');
jest.mock('../../Service/CacheService');
jest.mock('../../Util/Helper');

describe('UserProcessAction', () => {
  let userProcessAction: UserProcessAction;
  let userRepoMock: jest.Mocked<UserRepo>;
  let cacheServiceMock: jest.Mocked<typeof CacheService>;
  let hashPasswordMock: jest.MockedFunction<typeof hashPassword>;

  beforeEach(() => {
    userRepoMock = new UserRepo() as jest.Mocked<UserRepo>;
    userProcessAction = new UserProcessAction();
    userProcessAction['userRepo'] = userRepoMock;
    cacheServiceMock = CacheService as jest.Mocked<typeof CacheService>;
    hashPasswordMock = hashPassword as jest.MockedFunction<typeof hashPassword>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveUser', () => {
    it('should save user and cache the user data', async () => {
      const reqUser: UserRegisterParams = { email: 'srtipu5@gmail.com', password: 'password' };
      const hashedPassword = 'hashedPassword';
      const savedUser: UserModel = { id: 1, email: reqUser.email, password: hashedPassword } as UserModel;

      userRepoMock.findByEmail.mockResolvedValue(null);
      hashPasswordMock.mockResolvedValue(hashedPassword);
      userRepoMock.save.mockResolvedValue(savedUser);

      const result = await userProcessAction.saveUser(reqUser);

      expect(result).toEqual(savedUser);
      expect(userRepoMock.findByEmail).toHaveBeenCalledWith(reqUser.email);
      expect(hashPasswordMock).toHaveBeenCalledWith(reqUser.password);
      expect(userRepoMock.save).toHaveBeenCalledWith(expect.objectContaining({ email: reqUser.email, password: hashedPassword }));
      expect(cacheServiceMock.set).toHaveBeenCalledWith(`user:${reqUser.email}`, savedUser, 30);
    });

    it('should throw an error if user already exists', async () => {
      const reqUser: UserRegisterParams = { email: 'test@example.com', password: 'password123' };
      const existingUser: UserModel = { id: 1, email: reqUser.email, password: 'hashedPassword123' } as UserModel;

      userRepoMock.findByEmail.mockResolvedValue(existingUser);

      await expect(userProcessAction.saveUser(reqUser)).rejects.toThrow(AppError);
      expect(userRepoMock.findByEmail).toHaveBeenCalledWith(reqUser.email);
    });
  });

  describe('updateUser', () => {
    it('should update user password and cache the updated user data', async () => {
      const reqPassword = 'newPassword123';
      const hashedPassword = 'hashedNewPassword123';
      const existingUser: UserModel = { id: 1, email: 'test@gmail.com', password: 'oldPassword123' } as UserModel;
      const updatedUser: UserModel = { ...existingUser, password: hashedPassword };

      userRepoMock.findById.mockResolvedValue(existingUser);
      hashPasswordMock.mockResolvedValue(hashedPassword);
      userRepoMock.save.mockResolvedValue(updatedUser);

      const result = await userProcessAction.updateUser(existingUser.id, reqPassword);

      expect(result).toEqual(updatedUser);
      expect(userRepoMock.findById).toHaveBeenCalledWith(existingUser.id);
      expect(hashPasswordMock).toHaveBeenCalledWith(reqPassword);
      expect(userRepoMock.save).toHaveBeenCalledWith(expect.objectContaining({ password: hashedPassword }));
      expect(cacheServiceMock.set).toHaveBeenCalledWith(`user:${existingUser.email}`, updatedUser, 30);
    });

    it('should throw an error if user not found', async () => {
      const reqPassword = 'newPassword123';

      userRepoMock.findById.mockResolvedValue(null);

      await expect(userProcessAction.updateUser(1, reqPassword)).rejects.toThrow(AppError);
      expect(userRepoMock.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteUser', () => {
    it('should delete user and remove from cache', async () => {
      const existingUser: UserModel = { id: 1, email: 'test1@yahoo.com', password: 'password123' } as UserModel;

      userRepoMock.findById.mockResolvedValue(existingUser);
      userRepoMock.delete.mockResolvedValue(existingUser);

      const result = await userProcessAction.deleteUser(existingUser.id);

      expect(result).toEqual(existingUser);
      expect(userRepoMock.findById).toHaveBeenCalledWith(existingUser.id);
      expect(userRepoMock.delete).toHaveBeenCalledWith(existingUser);
      expect(cacheServiceMock.del).toHaveBeenCalledWith(`user:${existingUser.email}`);
    });

    it('should throw an error if user deletion fails', async () => {
      const existingUser: UserModel = { id: 1, email: 'test@example.com', password: 'password1' } as UserModel;

      userRepoMock.findById.mockResolvedValue(existingUser);
      userRepoMock.delete.mockResolvedValue(null);

      await expect(userProcessAction.deleteUser(existingUser.id)).rejects.toThrow(AppError);
    });
  });

  describe('listOfUser', () => {
    it('should return a list of users', async () => {
      const users: UserModel[] = [
        { id: 1, email: 'test1@example.com', password: 'password123' } as UserModel,
        { id: 2, email: 'test2@example.com', password: 'password123' } as UserModel,
      ];

      userRepoMock.find.mockResolvedValue(users);

      const result = await userProcessAction.listOfUser();

      expect(result).toEqual(users);
      expect(userRepoMock.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if no users are found', async () => {
      userRepoMock.find.mockResolvedValue(null);

      await expect(userProcessAction.listOfUser()).rejects.toThrow(AppError);
    });
  });

  describe('findUserByEmail', () => {
    it('should return user from cache if exists', async () => {
      const cachedUser: UserModel = { id: 1, email: 'test@example.com', password: 'password123' } as UserModel;

      cacheServiceMock.get.mockReturnValue(cachedUser);

      const result = await userProcessAction.findUserByEmail(cachedUser.email);

      expect(result).toEqual(cachedUser);
      expect(cacheServiceMock.get).toHaveBeenCalledWith(`user:${cachedUser.email}`);
      expect(userRepoMock.findByEmail).not.toHaveBeenCalled();
    });

    it('should return user from repository and cache it if not in cache', async () => {
      const email = 'test@example.com';
      const user: UserModel = { id: 1, email: email, password: 'password123' } as UserModel;

      cacheServiceMock.get.mockReturnValue(null);
      userRepoMock.findByEmail.mockResolvedValue(user);

      const result = await userProcessAction.findUserByEmail(email);

      expect(result).toEqual(user);
      expect(cacheServiceMock.get).toHaveBeenCalledWith(`user:${email}`);
      expect(userRepoMock.findByEmail).toHaveBeenCalledWith(email);
      expect(cacheServiceMock.set).toHaveBeenCalledWith(`user:${email}`, user, 30);
    });

    it('should throw an error if user is not found', async () => {
      const email = 'test@example.com';

      cacheServiceMock.get.mockReturnValue(null);
      userRepoMock.findByEmail.mockResolvedValue(null);

      await expect(userProcessAction.findUserByEmail(email)).rejects.toThrow(AppError);
      expect(userRepoMock.findByEmail).toHaveBeenCalledWith(email);
    });
  });
});
