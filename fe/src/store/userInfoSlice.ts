import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "@/types/auth";

interface UserInfoState {
  isLogin: boolean;
  userInfo: UserType | null;
}

const initialState: UserInfoState = {
  isLogin: false,
  userInfo: null,
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserType>) => {
      state.isLogin = true;
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.isLogin = false;
      state.userInfo = null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
