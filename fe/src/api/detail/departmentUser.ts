import apiClient from "../client";

interface DepartmentUserResponse {
    user_id: number;
    user_name: string;
}

export const getUserByDepartment = async (
    department_id: number
): Promise<DepartmentUserResponse[]> => {
    return apiClient<DepartmentUserResponse[]>(`/user/${department_id}`, {
        method: "GET",
        cache: "no-store",
    });
};
