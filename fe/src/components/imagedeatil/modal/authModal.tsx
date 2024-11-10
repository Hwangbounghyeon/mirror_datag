import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Select,
    SelectItem,
    Chip,
} from "@nextui-org/react";
import { useAuthoritySelect } from "@/hooks/imageDetail/useAuthoritySelect";
import { AuthUser } from "@/types/auth";
import { Suspense } from "react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (userIds: number[]) => void;
    existingAuthorities: AuthUser[];
}

export default function AuthModal({
    isOpen,
    onClose,
    onAdd,
    existingAuthorities,
}: AuthModalProps) {
    const {
        departments,
        selectedDepartment,
        selectedPeople,
        availableUsers,
        handleDepartmentSelect,
        handlePeopleSelect,
        handleRemovePerson,
        reset,
    } = useAuthoritySelect(existingAuthorities);

    const handleConfirm = () => {
        const userIds = selectedPeople.map((person) => person.user_id);
        onAdd(userIds);
        reset();
        onClose();
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    return (
        <Modal
            size={"4xl"}
            isOpen={isOpen}
            onClose={handleCancel}
            classNames={{
                base: "min-h-[50%]",
                wrapper: "min-h-[50%]",
                body: "flex-grow",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader>Add Authority</ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center">
                                            <div>Loading departments...</div>
                                        </div>
                                    }
                                >
                                    {Array.isArray(departments) &&
                                    departments.length > 0 ? (
                                        <Select
                                            label="Department"
                                            placeholder="Select a department"
                                            selectedKeys={
                                                selectedDepartment
                                                    ? [selectedDepartment]
                                                    : []
                                            }
                                            onChange={(e) => {
                                                handleDepartmentSelect(
                                                    e.target.value
                                                );
                                            }}
                                        >
                                            {departments.map((dept) => {
                                                return (
                                                    <SelectItem
                                                        key={
                                                            dept.department_name
                                                        }
                                                        value={
                                                            dept.department_name
                                                        }
                                                    >
                                                        {dept.department_name}
                                                    </SelectItem>
                                                );
                                            })}
                                        </Select>
                                    ) : (
                                        <div>No departments available</div>
                                    )}
                                </Suspense>

                                {selectedDepartment && (
                                    <Select
                                        label="People"
                                        placeholder="Select people"
                                        selectionMode="multiple"
                                        selectedKeys={selectedPeople
                                            .filter(
                                                (p) =>
                                                    p.department_name ===
                                                    selectedDepartment
                                            )
                                            .map((p) => p.user_id.toString())}
                                        onChange={(e) =>
                                            handlePeopleSelect(
                                                Array.from(e.target.value)
                                            )
                                        }
                                    >
                                        {availableUsers.map((user) => (
                                            <SelectItem
                                                key={user.uid.toString()}
                                            >
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}

                                {selectedPeople.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPeople.map((person) => (
                                            <Chip
                                                key={person.user_id}
                                                onClose={() =>
                                                    handleRemovePerson(
                                                        person.user_id
                                                    )
                                                }
                                                variant="flat"
                                            >
                                                {person.user_name} /{" "}
                                                {person.department_name}
                                            </Chip>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onPress={handleCancel}>
                                Close
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleConfirm}
                                isDisabled={selectedPeople.length === 0}
                            >
                                Add
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
