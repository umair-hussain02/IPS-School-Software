export interface LoginCredentials {
  id: string;
  password: string;
}

export interface LoginResponse {
  data: {
    id: string;
    fullName: string;
    role: "admin" | "teacher" | "student";
    status: string;
    refreshToken: string;
  };
  role: "admin" | "teacher" | "student" | null;
  refreshToken: string;
}

export interface AuthState {
  user: LoginResponse["data"] | null;
  role: "admin" | "teacher" | "student" | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface ApiError {
  message: string;
}
