export interface UserRegisterParams {
  email: string;
  password: string;
}

export interface UserUpdateParams {
  password: string;
}

export interface UserSearchParams {
  email: string;
}

export interface UserIdParams {
  userId: number;
}

export interface TextRegisterParams {
  content: string;
}

export interface UserAuthParams {
  email: string;
  password: string;
}