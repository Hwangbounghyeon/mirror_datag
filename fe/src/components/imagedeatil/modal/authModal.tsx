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
import { DEPARTMENTS } from "@/lib/constants/mockData";
import { useAuthoritySelect } from "@/hooks/imageDetail/useAuthoritySelect";
import { AuthUser } from "@/types/auth";

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
                                <Select
                                    label="Department"
                                    placeholder="Select a department"
                                    selectedKeys={
                                        selectedDepartment
                                            ? [selectedDepartment.toString()]
                                            : []
                                    }
                                    onChange={(e) =>
                                        handleDepartmentSelect(e.target.value)
                                    }
                                >
                                    {DEPARTMENTS.map((dept) => (
                                        <SelectItem key={dept.department_name}>
                                            {dept.department_name}
                                        </SelectItem>
                                    ))}
                                </Select>

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
