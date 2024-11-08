import { useReducer, Reducer } from "react";
import { CreateProjectType } from "@/types/projectType";

const initCreateProjectItem: CreateProjectType = {
  project_name: "",
  project_model_name: "",
  description: "",
  accesscontrol: {
    view_users: [],
    edit_users: [],
    view_departments: [],
    edit_departments: [],
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
    default:
      return state;
  }
};

export default function useCreateProject() {
  const [state, dispatch] = useReducer(reducer, initData);

  return { state, dispatch };
}
