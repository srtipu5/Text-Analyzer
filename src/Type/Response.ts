export interface AuthResponse {
    success: boolean;
    token?: string;
    errorCode?: number;
  }

  export interface ApiResponse {
    message: string;
    data?: any;
  }