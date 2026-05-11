export interface UserFieldLogin {
  name: string;
  password: string;
  message?: string;
  status?: string;
}

export interface UserResponse {
  name: string;
  password: string;
  message?: string;
  status?: number;
  fields?: "name" | "email";
}

export interface UserFieldRegistration {
  name: string;
  password: string;
  email: string;
  passwordConfirm?: string;
  message?: string;
}

export interface UserFieldRestore {
  email: string;
}

export interface UserFieldResetPassword {
  password: string;
  token?: string | null;
  passwordConfirm?: string;
}
