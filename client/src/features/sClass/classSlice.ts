import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import classApi from "./classapi";
import type { AxiosError } from "axios";
import type {
  ApiError,
  ClassState,
  GetAllClassResponse,
} from "@/types/class.type";

// -------------------- Actions ---------------

export const getAllClasses = createAsyncThunk<
  GetAllClassResponse,
  void,
  { rejectValue: ApiError }
>("getAllClasses", async (_, { rejectWithValue }) => {
  try {
    const response = await classApi.getAllClasses();
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    if (err.response && err.response.data) {
      return rejectWithValue(err.response.data);
    }

    return rejectWithValue({ message: "Something went wrong" });
  }
});

// ------------------ Initial State ---------------
const initialState: ClassState = {
  classes: [],
  loading: false,
  error: null,
};

// ----------------- Slice --------------------

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.data;
      })
      .addCase(getAllClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ApiError | null;
      });
  },
});

export default classSlice.reducer;
