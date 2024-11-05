import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { set } from "react-hook-form";

interface UserInfo {
  user_id: number;
  name: string;
  email: string;
  department_id: number;
  is_superuser: boolean;
}

interface AuthState {
  accessToken: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  userInfo: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.userInfo = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAccessToken, setUserInfo, clearAuth } = authSlice.actions;
export default authSlice.reducer;
