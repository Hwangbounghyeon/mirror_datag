import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./userInfoSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    auth: authReducer,
  },
});

export default store;
