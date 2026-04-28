export type UserRole = "TEACHER" | "STUDENT";

export type AuthUser = {
  id: string;
  phoneNumber: string;
  name: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
};
