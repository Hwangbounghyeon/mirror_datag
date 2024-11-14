// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import projectReducer from "@/store/create-store";

enableMapSet();

export const store = configureStore({
  reducer: {
    project: projectReducer,
  },
  devTools: process.env.NODE_ENV === "development",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
