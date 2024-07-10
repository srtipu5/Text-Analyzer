export interface UserRegisterParams {
  email: string;
  password: string;
}

export interface EmailParams {
  email: string;
}

export interface IdParams {
  id: number;
}

export interface UserIdParams {
  userId: number;
}

export interface UpdateParams {
  id: number;
  password: string;
}

export interface TextRegisterParams {
  content: string;
}