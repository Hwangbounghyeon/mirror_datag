import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react";
import { IoCloseOutline } from "react-icons/io5";
import FilterComponent from "./filterBox";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDone?: () => void;
}

export const FilterModal = ({ isOpen, onClose, onDone }: FilterModalProps) => {
    return (
        <Modal
            size="2xl"
            isOpen={isOpen}
            onClose={onClose}
            classNames={{
                base: "bg-content1",
                body: "py-6",
                wrapper: "z-[100]",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex justify-between items-center">
                            <span className="text-lg font-semibold">
                                필터 설정
                            </span>
                        </ModalHeader>

                        <ModalBody>
                            <FilterComponent
                                onDone={() => {
                                    if (onDone) onDone();
                                    onClose();
                                }}
                            />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
