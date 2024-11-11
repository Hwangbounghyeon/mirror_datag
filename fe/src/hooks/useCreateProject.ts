import { useReducer, Reducer, useCallback } from "react";

import {
  CreateProjectType,
  SearchUserType,
  SearchDepartmentWithAutyType,
  ProjectAuthType,
  SearchUserWithAuthType,
} from "@/types/projectType";

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
    };

const reducer: Reducer<StateType, ActionType> = (state, action): StateType => {
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
      const newUsers = new Map(state.createProjectItem.accesscontrol.users);
      const { Auth, ...userWithoutAuth } = action.payload;
      newUsers.set(action.payload.user_id, {
        ...userWithoutAuth,
        Auth: Auth,
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
    case "REMOVE_USER": {
      const newUsers = new Map(state.createProjectItem.accesscontrol.users);
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
      const newUsers = new Map(state.createProjectItem.accesscontrol.users);
      const user = newUsers.get(action.payload.userId);
      if (user) {
        newUsers.set(action.payload.userId, {
          ...user,
          Auth: action.payload.auth,
        });
      }
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
      const newDepartments = new Map(
        state.createProjectItem.accesscontrol.departments
      );
      const department = newDepartments.get(action.payload.departmentId);
      if (department) {
        newDepartments.set(action.payload.departmentId, {
          ...department,
          Auth: action.payload.auth,
        });
      }
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
    default:
      return state;
  }
};

export default function useCreateProject() {
  const [state, dispatch] = useReducer(reducer, initData);

  const addUser = useCallback((user: SearchUserWithAuthType) => {
    dispatch({ type: "ADD_USER", payload: user });
  }, []);

  const removeUser = useCallback((userId: number) => {
    dispatch({ type: "REMOVE_USER", payload: userId });
  }, []);

  const updateUserAuth = useCallback(
    (userId: number, auth: ProjectAuthType) => {
      dispatch({
        type: "UPDATE_USER_AUTH",
        payload: { userId, auth },
      });
    },
    []
  );

  const addDepartment = useCallback(
    (department: SearchDepartmentWithAutyType) => {
      dispatch({ type: "ADD_DEPARTMENT", payload: department });
    },
    []
  );

  const removeDepartment = useCallback((departmentId: number) => {
    dispatch({ type: "REMOVE_DEPARTMENT", payload: departmentId });
  }, []);

  const updateDepartmentAuth = useCallback(
    (departmentId: number, auth: ProjectAuthType) => {
      dispatch({
        type: "UPDATE_DEPARTMENT_AUTH",
        payload: { departmentId, auth },
      });
    },
    []
  );

  const clearAccessControl = useCallback(() => {
    dispatch({ type: "CLEAR_ACCESS_CONTROL" });
  }, []);

  return {
    state,
    dispatch,
    addUser,
    removeUser,
    updateUserAuth,
    addDepartment,
    removeDepartment,
    updateDepartmentAuth,
    clearAccessControl,
  };
}
