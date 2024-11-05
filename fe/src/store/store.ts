import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./userInfoSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    auth: authReducer,
  },
});
