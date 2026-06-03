import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Student, RegisterData, LoginData, AuthResponse } from './api';
import * as authApi from './api';

export interface AuthState {
  student: Student | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  student: null,
  token: localStorage.getItem('authToken'),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
};

// Async thunks for API calls
export const registerStudentAsync = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.registerStudent(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginStudentAsync = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authApi.loginStudent(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.student = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerStudentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStudentAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerStudentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginStudentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStudentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.student = action.payload.student;
        state.isAuthenticated = true;
        localStorage.setItem('authToken', action.payload.token);
      })
      .addCase(loginStudentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;