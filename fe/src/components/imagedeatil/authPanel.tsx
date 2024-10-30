import { Authority } from "@/hooks/imageDetail/useItemManager";
import React from "react";
import { MdOutlineClear } from "react-icons/md";

interface AuthorityPanelProps {
    authorities: Authority[];
    onRemove: (index: number) => void;
    onAdd: (authority: Authority) => void;
}

function AuthPanel({ authorities, onRemove, onAdd }: AuthorityPanelProps) {
    return (
        <div className="h-full flex flex-col">
            <div className="p-4 pb-2">
                <h2 className="text-lg font-semibold">AUTHORITY</h2>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4">
                <div className="flex flex-col gap-2">
                    {authorities.map((authority, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-3 py-2 rounded-full border border-blue-400"
                        >
                            <span className="text-sm text-blue-400">
                                {authority.name} / {authority.department}
                            </span>
                            <button
                                onClick={() => onRemove(index)}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                <MdOutlineClear />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AuthPanel;
