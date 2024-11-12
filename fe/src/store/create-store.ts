import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CreateProjectType,
  SearchDepartmentWithAutyType,
  ProjectAuthType,
  SearchUserWithAuthType,
} from "@/types/projectType";

const VALID_AUTH_TYPES: ProjectAuthType[] = ["ReadOnly", "Read&Write"];

const initialState: CreateProjectType = {
  project_name: "",
  project_model_name: "",
  description: "",
  accesscontrol: {
    users: new Map<number, SearchUserWithAuthType>(),
    departments: new Map<number, SearchDepartmentWithAutyType>(),
  },
  is_private: false,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectName: (state, action: PayloadAction<string>) => {
      state.project_name = action.payload;
    },
    setProjectModelName: (state, action: PayloadAction<string>) => {
      state.project_model_name = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setIsPrivate: (state, action: PayloadAction<boolean>) => {
      state.is_private = action.payload;
    },
    addUser: (state, action: PayloadAction<SearchUserWithAuthType>) => {
      state.accesscontrol.users.set(action.payload.user_id, action.payload);
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.accesscontrol.users.delete(action.payload);
    },
    addDepartment: (
      state,
      action: PayloadAction<SearchDepartmentWithAutyType>
    ) => {
      state.accesscontrol.departments.set(
        action.payload.department_id,
        action.payload
      );
    },
    removeDepartment: (state, action: PayloadAction<number>) => {
      state.accesscontrol.departments.delete(action.payload);
    },
    updateUserAuth: (
      state,
      action: PayloadAction<{ userId: number; auth: ProjectAuthType }>
    ) => {
      const user = state.accesscontrol.users.get(action.payload.userId);
      if (user) {
        user.Auth = action.payload.auth;
        state.accesscontrol.users.set(action.payload.userId, user);
      }
    },
    updateDepartmentAuth: (
      state,
      action: PayloadAction<{ departmentId: number; auth: ProjectAuthType }>
    ) => {
      const department = state.accesscontrol.departments.get(
        action.payload.departmentId
      );
      if (department) {
        department.Auth = action.payload.auth;
        state.accesscontrol.departments.set(
          action.payload.departmentId,
          department
        );
      }
    },
    resetProject: (state) => {
      return initialState;
    },
  },
});

export const {
  setProjectName,
  setProjectModelName,
  setDescription,
  setIsPrivate,
  addUser,
  removeUser,
  addDepartment,
  removeDepartment,
  updateUserAuth,
  updateDepartmentAuth,
  resetProject,
} = projectSlice.actions;

export default projectSlice.reducer;
