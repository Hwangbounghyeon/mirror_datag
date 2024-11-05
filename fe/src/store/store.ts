import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./userInfoSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
