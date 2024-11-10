import apiClient from "../client";

interface Department {
    department_id: number;
    department_name: string;
}

interface DepartmentUserResponse {
    user_id: number;
    user_name: string;
}

export const departmentApi = async () => {
    const response = await apiClient<{ status: number; data: Department[] }>(
        "/department/list",
        {
            method: "GET",
            cache: "no-store",
        }
    );

    if (!response.data) {
        throw new Error("No data received");
    }

    return response.data;
};

export const getUserByDepartment = async (
    department_id: number
): Promise<DepartmentUserResponse[]> => {
    return apiClient<DepartmentUserResponse[]>(`/user/${department_id}`, {
        method: "GET",
        cache: "no-store",
    });
};
