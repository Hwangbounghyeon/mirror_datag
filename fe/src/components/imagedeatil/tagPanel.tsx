import React, { useState } from "react";
import { MdOutlineClear } from "react-icons/md";

interface TagPanelProps {
    tags: string[];
    onRemoveTag: (index: number) => void;
    onAddTag: (tag: string) => void;
}

function TagPanel({ tags, onRemoveTag, onAddTag }: TagPanelProps) {
    const [newTag, setNewTag] = useState("");

    const handleAddTag = () => {
        if (newTag.trim()) {
            onAddTag(newTag.trim());
            setNewTag("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddTag();
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 pb-2">
                <h2 className="text-lg font-semibold">TAGS</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 max-h-[calc(100%-6rem)]">
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 rounded-full border border-blue-400"
                        >
                            <span className="text-sm text-blue-400">{tag}</span>
                            <button
                                onClick={() => onRemoveTag(index)}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                <MdOutlineClear />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4">
                <div className="flex h-10 rounded-full border border-blue-400 overflow-hidden">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="w-full px-4 bg-transparent text-white outline-none text-sm"
                        placeholder="Enter tag..."
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleAddTag}
                        className="px-6 bg-blue-400 text-black font-medium hover:bg-blue-500 transition-colors"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
export default TagPanel;
