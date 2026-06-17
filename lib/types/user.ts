export type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  favorites?: string[];
};

export type AuthUser = User & {
  favorites?: string[];
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};
