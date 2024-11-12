import { useReducer, Reducer, useCallback } from "react";

import {
  CreateProjectType,
  SearchDepartmentWithAutyType,
  ProjectAuthType,
  SearchUserWithAuthType,
} from "@/types/projectType";

// 유효성 검사를 위한 상수
const VALID_AUTH_TYPES: ProjectAuthType[] = ["ReadOnly", "Read&Write", "None"];

const initCreateProjectItem: CreateProjectType = {
  project_name: "",
  project_model_name: "",
  description: "",
  accesscontrol: {
    users: new Map<number, SearchUserWithAuthType>(),
    departments: new Map<number, SearchDepartmentWithAutyType>(),
  },
  is_private: false,
};

const initialCategory: string = "";

const initData = {
  createProjectItem: initCreateProjectItem,
  category: initialCategory,
};

type StateType = typeof initData;

type ActionType =
  | {
      type: "SET_CATEGORY";
      payload: string;
    }
  | {
      type: "SET_PROJECT_ITEM";
      payload: { [key in keyof CreateProjectType]?: CreateProjectType[key] };
    }
  | {
      type: "ADD_USER";
      payload: SearchUserWithAuthType;
    }
  | {
      type: "REMOVE_USER";
      payload: number;
    }
  | {
      type: "UPDATE_USER_AUTH";
      payload: {
        userId: number;
        auth: ProjectAuthType;
      };
    }
  | {
      type: "ADD_DEPARTMENT";
      payload: SearchDepartmentWithAutyType;
    }
  | {
      type: "REMOVE_DEPARTMENT";
      payload: number;
    }
  | {
      type: "UPDATE_DEPARTMENT_AUTH";
      payload: {
        departmentId: number;
        auth: ProjectAuthType;
      };
    }
  | {
      type: "CLEAR_ACCESS_CONTROL";
    }
  | {
      type: "RESET_STATE";
    };

// 유효성 검사 함수들
const isValidAuth = (auth: string): auth is ProjectAuthType => {
  return VALID_AUTH_TYPES.includes(auth as ProjectAuthType);
};

const isValidUser = (user: SearchUserWithAuthType): boolean => {
  return Boolean(user && user.user_id && isValidAuth(user.Auth));
};

const isValidDepartment = (
  department: SearchDepartmentWithAutyType
): boolean => {
  return Boolean(
    department && department.department_id && isValidAuth(department.Auth)
  );
};

const reducer: Reducer<StateType, ActionType> = (state, action): StateType => {
  try {
    switch (action.type) {
      case "SET_CATEGORY":
        return {
          ...state,
          category: action.payload,
        };
      case "SET_PROJECT_ITEM":
        return {
          ...state,
          createProjectItem: {
            ...state.createProjectItem,
            ...action.payload,
          },
        };
      case "ADD_USER": {
        if (!isValidUser(action.payload)) {
          throw new Error("Invalid user data");
        }
        const newUsers = new Map(state.createProjectItem.accesscontrol.users);
        newUsers.set(action.payload.user_id, action.payload);
        return {
          ...state,
          createProjectItem: {
            ...state.createProjectItem,
            accesscontrol: {
              ...state.createProjectItem.accesscontrol,
              users: newUsers,
            },
          },
        };
      }
      case "REMOVE_USER": {
        const newUsers = new Map(state.createProjectItem.accesscontrol.users);
        if (!newUsers.has(action.payload)) {
          throw new Error("User not found");
        }
        newUsers.delete(action.payload);
        return {
          ...state,
          createProjectItem: {
            ...state.createProjectItem,
            accesscontrol: {
              ...state.createProjectItem.accesscontrol,
              users: newUsers,
            },
          },
        };
      }
      case "UPDATE_USER_AUTH": {
        if (!isValidAuth(action.payload.auth)) {
          throw new Error("Invalid auth type");
        }
        const newUsers = new Map(state.createProjectItem.accesscontrol.users);
        const user = newUsers.get(action.payload.userId);
        if (!user) {
          throw new Error("User not found");
        }
        newUsers.set(action.payload.userId, {
          ...user,
          Auth: action.payload.auth,
        });
        return {
          ...state,
          createProjectItem: {
            ...state.createProjectItem,
            accesscontrol: {
              ...state.createProjectItem.accesscontrol,
              users: newUsers,
            },
          },
        };
      }
      case "ADD_DEPARTMENT": {
        if (!isValidDepartment(action.payload)) {
          throw new Error("Invalid department data");
        }
        const newDepartments = new Map(
          state.createProjectItem.accesscontrol.departments
        );
        newDepartments.set(action.payload.department_id, action.payload);
        return {
          ...state,
          createProjectItem: {
            ...state.createProjectItem,
            accesscontrol: {
              ...state.createProjectItem.accesscontrol,
              departments: newDepartments,
            },
          },
        };
      }
      case "REMOVE_DEPARTMENT": {
        const newDepartments = new Map(
          state.createProjectItem.accesscontrol.departments
        );
        if (!newDepartments.has(action.payload)) {
          throw new Error("Department not found");
        }
        newDepartments.delete(action.payload);
        return {
          ...state,
          createProjectItem: {
            ...state.createProjectItem,
            accesscontrol: {
              ...state.createProjectItem.accesscontrol,
              departments: newDepartments,
            },
          },
        };
      }
      case "UPDATE_DEPARTMENT_AUTH": {
        if (!isValidAuth(action.payload.auth)) {
          throw new Error("Invalid auth type");
        }
        const newDepartments = new Map(
          state.createProjectItem.accesscontrol.departments
        );
        const department = newDepartments.get(action.payload.departmentId);
        if (!department) {
          throw new Error("Department not found");
        }
        newDepartments.set(action.payload.departmentId, {
          ...department,
          Auth: action.payload.auth,
        });
        return {
          ...state,
          createProjectItem: {
            ...state.createProjectItem,
            accesscontrol: {
              ...state.createProjectItem.accesscontrol,
              departments: newDepartments,
            },
          },
        };
      }
      case "CLEAR_ACCESS_CONTROL":
        return {
          ...state,
          createProjectItem: {
            ...state.createProjectItem,
            accesscontrol: {
              users: new Map<number, SearchUserWithAuthType>(),
              departments: new Map<number, SearchDepartmentWithAutyType>(),
            },
          },
        };
      case "RESET_STATE":
        return initData;
      default:
        return state;
    }
  } catch (error) {
    console.error("Reducer error:", error);
    return state;
  }
};

export default function useCreateProject() {
  const [state, dispatch] = useReducer(reducer, initData);

  const handleProjectItemChange = useCallback(
    (updates: Partial<CreateProjectType>) => {
      dispatch({
        type: "SET_PROJECT_ITEM",
        payload: updates,
      });
    },
    []
  );

  const handleCategoryChange = useCallback((category: string) => {
    dispatch({
      type: "SET_CATEGORY",
      payload: category,
    });
  }, []);

  const addUser = useCallback((user: SearchUserWithAuthType) => {
    try {
      dispatch({ type: "ADD_USER", payload: user });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }, []);

  const removeUser = useCallback((userId: number) => {
    try {
      dispatch({ type: "REMOVE_USER", payload: userId });
    } catch (error) {
      console.error("Error removing user:", error);
    }
  }, []);

  const updateUserAuth = useCallback(
    (userId: number, auth: ProjectAuthType) => {
      try {
        dispatch({
          type: "UPDATE_USER_AUTH",
          payload: { userId, auth },
        });
      } catch (error) {
        console.error("Error updating user auth:", error);
      }
    },
    []
  );

  const addDepartment = useCallback(
    (department: SearchDepartmentWithAutyType) => {
      try {
        dispatch({ type: "ADD_DEPARTMENT", payload: department });
      } catch (error) {
        console.error("Error adding department:", error);
      }
    },
    []
  );

  const removeDepartment = useCallback((departmentId: number) => {
    try {
      dispatch({ type: "REMOVE_DEPARTMENT", payload: departmentId });
    } catch (error) {
      console.error("Error removing department:", error);
    }
  }, []);

  const updateDepartmentAuth = useCallback(
    (departmentId: number, auth: ProjectAuthType) => {
      try {
        dispatch({
          type: "UPDATE_DEPARTMENT_AUTH",
          payload: { departmentId, auth },
        });
      } catch (error) {
        console.error("Error updating department auth:", error);
      }
    },
    []
  );

  const clearAccessControl = useCallback(() => {
    dispatch({ type: "CLEAR_ACCESS_CONTROL" });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  return {
    state,
    handleCategoryChange,
    handleProjectItemChange,
    addUser,
    removeUser,
    updateUserAuth,
    addDepartment,
    removeDepartment,
    updateDepartmentAuth,
    clearAccessControl,
    resetState,
  };
}
