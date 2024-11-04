import { useMemo, useState } from "react";
import { USERS } from "../../../lib/constants/mockData";
import { Input, Listbox, ListboxItem } from "@nextui-org/react";
import { Authority, Department, User } from "@/types/auth";

interface PersonSelectProps {
    selectedDepartment: Department;
    personSearch: string;
    onSearchChange: (value: string) => void;
    onSelect: (user: User) => void;
    selectedPeople: Authority[];
    existingAuthorities: Authority[];
}

export function PersonSelect({
    selectedDepartment,
    personSearch,
    onSearchChange,
    onSelect,
    selectedPeople,
    existingAuthorities,
}: PersonSelectProps) {
    const [isFocused, setIsFocused] = useState(false);

    const filteredUsers = useMemo(() => {
        if (!selectedDepartment) return [];
        if (!isFocused) return [];

        const availableUsers = USERS.filter(
            (user) =>
                user.department === selectedDepartment.department_id &&
                !selectedPeople.some(
                    (selected) => selected.id === user.user_id
                ) &&
                !existingAuthorities.some(
                    (existing) => existing.id === user.user_id
                )
        );

        if (!personSearch) {
            return availableUsers;
        }

        return availableUsers.filter((user) =>
            user.name.toLowerCase().includes(personSearch.toLowerCase())
        );
    }, [
        selectedDepartment,
        isFocused,
        personSearch,
        selectedPeople,
        existingAuthorities,
    ]);

    return (
        <div className="relative">
            <Input
                label="Person"
                value={personSearch}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search person..."
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setTimeout(() => setIsFocused(false), 200);
                }}
            />
            {isFocused && filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-auto">
                    <Listbox>
                        {filteredUsers.map((user) => (
                            <ListboxItem
                                key={user.user_id}
                                onClick={() => onSelect(user)}
                            >
                                {user.name}
                            </ListboxItem>
                        ))}
                    </Listbox>
                </div>
            )}
        </div>
    );
}
