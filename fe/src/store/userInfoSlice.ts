import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  user_id: number;
  name: string;
  email: string;
  department_id: number;
  is_superuser: boolean;
}

interface UserInfoState {
  isLogin: boolean;
  userInfo: UserInfo | null;
}

const initialState: UserInfoState = {
  isLogin: false,
  userInfo: null,
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfoState>) => {
      state.isLogin = true;
      state.userInfo = action.payload.userInfo;
    },
    clearUserInfo: (state) => {
      state.isLogin = false;
      state.userInfo = null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
