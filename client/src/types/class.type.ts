export interface Teacher {
  _id: string;
  fullName: string;
}

export interface ClassData {
  _id: string;
  className: string;
  section: string;
  teacher: Teacher;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface GetAllClassResponse {
  success: boolean;
  data: ClassData[];
}

export interface ApiError {
  message: string;
}

export interface ClassState {
  classes: ClassData[];
  loading: boolean;
  error: ApiError | null;
}
