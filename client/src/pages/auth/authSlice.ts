import type {
  ApiError,
  AuthState,
  LoginCredentials,
  LoginResponse,
} from "@/types/auth.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authAPI from "./authApi";
import { AxiosError } from "axios";

// -----------------------    Actions  ----------------------

// Login admin
export const login = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: ApiError }
>("admin/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(credentials);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;

    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }

    return rejectWithValue({ message: "Something went wrong" });
  }
});

// -------------------------    Slices    -------------------------

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("User") || "null"),
  role: null,
  refreshToken: JSON.parse(localStorage.getItem("refreshToken") || "null"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ----------  Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("User", JSON.stringify(action.payload.data));
        console.log(action.payload.data);

        localStorage.setItem(
          "refreshToken",
          JSON.stringify(action.payload.refreshToken)
        );
        console.log();
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : "Unknown error";
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
