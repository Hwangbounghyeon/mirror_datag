// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "@/store/create-store";

export const store = configureStore({
  reducer: {
    project: projectReducer,
  },
  devTools: process.env.NODE_ENV === "development",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
