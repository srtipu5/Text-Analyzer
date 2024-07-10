import { getRepository, Repository } from "typeorm";
import { log } from "../../Util/Helper";
import { UserModel } from "../Model/UserModel";

let userRepository: Repository<UserModel>;

const initializeRepository = () => {
  if (!userRepository) {
    userRepository = getRepository(UserModel);
  }
  return userRepository;
};

export const findAll = async (): Promise<UserModel[] | null> => {
    try {
      const repo = initializeRepository();
      const users = await repo.find();
      return users || null;
    } catch (error) {
      log("Error in findAll:", error);
      return null;
    }
  };

export const findByEmail = async (email: string): Promise<UserModel | null> => {
  try {
    const repo = initializeRepository();
    const user = await repo.findOne({ where: { email } });
    return user || null;
  } catch (error) {
    log("Error in findByEmail:", error);
    return null;
  }
};

export const findById = async (id: number): Promise<UserModel | null> => {
  try {
    const repo = initializeRepository();
    const user = await repo.findOne({ where: { id } });
    return user || null;
  } catch (error) {
    log("Error in findById:", error);
    return null;
  }
};

export const save = async (user: UserModel): Promise<boolean> => {
  try {
    const repo = initializeRepository();
    await repo.save(user);
    return true;
  } catch (error) {
    log("Error in save user:", error);
    return false;
  }
};

export const updatePassword = async (id: number, password: string): Promise<boolean> => {
  try {
    const repo = initializeRepository();
    const user = await findById(id);
    if (!user) return false;
    user.password = password;
    await repo.save(user);
    return true;
  } catch (error) {
    log("Error in updatePassword:", error);
    return false;
  }
};

export const deleteById = async (id: number): Promise<boolean> => {
  try {
    const repo = initializeRepository();
    const user = await findById(id);
    if (!user) return false;
    await repo.remove(user);
    return true;
  } catch (error) {
    log("Error in deleteById:", error);
    return false;
  }
};

export const deleteByEmail = async (email: string): Promise<boolean> => {
  try {
    const repo = initializeRepository();
    const user = await findByEmail(email);
    if (!user) return false;
    await repo.remove(user);
    return true;
  } catch (error) {
    log("Error in deleteByEmail:", error);
    return false;
  }
};
