import { useState } from "react";
import { DEPARTMENTS, USERS } from "@/lib/constants/mockData";
import { AuthUser } from "@/types/auth";

export function useAuthoritySelect(existingAuthorities: AuthUser[]) {
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
        null
    );
    const [selectedPeople, setSelectedPeople] = useState<AuthUser[]>([]);

    const handleDepartmentSelect = (deptId: string) => {
        const dept = DEPARTMENTS.find(
            (d) => d.department_name.toString() === deptId
        );
        if (dept) setSelectedDepartment(dept.department_name);
    };

    const handlePeopleSelect = (selectedIds: string[]) => {
        if (!selectedDepartment) return;

        const currentDeptPeople = selectedIds
            .map((id) => {
                const user = availableUsers.find(
                    (u) => u.uid.toString() === id
                );
                if (!user) return null;
                return {
                    user_id: user.uid,
                    user_name: user.name,
                    department_name: selectedDepartment,
                };
            })
            .filter((auth): auth is AuthUser => auth !== null);

        const otherDeptPeople = selectedPeople.filter(
            (p) => p.department_name !== selectedDepartment
        );

        setSelectedPeople([...otherDeptPeople, ...currentDeptPeople]);
    };

    const handleRemovePerson = (id: number) => {
        setSelectedPeople(selectedPeople.filter((p) => p.user_id !== id));
    };

    const availableUsers = selectedDepartment
        ? USERS.filter(
              (user) =>
                  user.department_name === selectedDepartment &&
                  !existingAuthorities.some((auth) => auth.user_id === user.uid)
          )
        : [];

    const reset = () => {
        setSelectedPeople([]);
        setSelectedDepartment(null);
    };

    return {
        selectedDepartment,
        selectedPeople,
        availableUsers,
        handleDepartmentSelect,
        handlePeopleSelect,
        handleRemovePerson,
        reset,
    };
}
