import React from "react";
import { BiPlus } from "react-icons/bi";
import { MdOutlineClear } from "react-icons/md";
import AuthModal from "./modal/authModal";
import { useDisclosure } from "@nextui-org/react";
import { AuthUser } from "@/types/auth";

interface AuthorityPanelProps {
    authorities: AuthUser[];
    onRemove: (userId: number) => void;
    onAdd: (userIds: number[]) => void;
}

function AuthPanel({ authorities, onRemove, onAdd }: AuthorityPanelProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div className="h-full flex flex-col">
            <div className="flex p-2 pb-2 justify-between items-center">
                <h2 className="text-lg font-semibold">AUTHORITY</h2>
                <BiPlus className="ms-2 cursor-pointer" onClick={onOpen}>
                    Add Authority
                </BiPlus>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-1 py-1">
                <div className="flex flex-col gap-2">
                    {authorities.map((authority) => (
                        <div
                            key={`auth-${authority.user_id}`}
                            className="flex items-center justify-between ps-3 py-1 rounded-full border border-blue-400"
                        >
                            <span className="text-sm text-blue-400">
                                {authority.user_name} /{" "}
                                {authority.department_name}
                            </span>
                            <button
                                onClick={() => onRemove(authority.user_id)}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                <MdOutlineClear />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <AuthModal
                isOpen={isOpen}
                onClose={onClose}
                onAdd={onAdd}
                existingAuthorities={authorities}
            />
        </div>
    );
}

export default AuthPanel;
