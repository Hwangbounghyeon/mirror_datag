import { Select, SelectItem } from "@nextui-org/react";
import { Authority, User } from "@/types/auth";
import { USERS } from "@/lib/constants/mockData";

interface PersonSelectProps {
    selectedDepartment: string;
    onSelect: (users: User[]) => void;
    selectedPeople: Authority[];
    existingAuthorities: Authority[];
}

export function PersonSelect({
    selectedDepartment,
    onSelect,
    selectedPeople,
    existingAuthorities,
}: PersonSelectProps) {
    const availableUsers = USERS.filter(
        (user) =>
            user.department_name === selectedDepartment &&
            !existingAuthorities.some(
                (existing) => existing.id === user.user_id
            )
    );

    return (
        <Select
            label="People"
            placeholder="Select people"
            selectionMode="multiple"
            selectedKeys={selectedPeople.map((p) => p.id.toString())}
            onChange={(e) => {
                const selectedIds = Array.from(e.target.value);
                const users = availableUsers.filter((user) =>
                    selectedIds.includes(user.user_id.toString())
                );
                onSelect(users);
            }}
        >
            {availableUsers.map((user) => (
                <SelectItem key={user.user_id} value={user.user_id}>
                    {user.name}
                </SelectItem>
            ))}
        </Select>
    );
}
