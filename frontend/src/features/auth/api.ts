import API from '../../shared/api/client';

export interface Student {
  id: number;
  full_name: string;
  email: string;
  year: '1st year' | '2nd year' | '3rd year' | '4th year';
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  year: '1st year' | '2nd year' | '3rd year' | '4th year';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  student: Student;
}

export const registerStudent = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const loginStudent = async (data: LoginData): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>('/auth/login', data);
  return response.data;
};
