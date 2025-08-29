import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../pages/auth/authSlice";
import classSlice from "../features/sClass/classSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    class: classSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
