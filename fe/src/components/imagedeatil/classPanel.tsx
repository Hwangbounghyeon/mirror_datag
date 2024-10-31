import React from "react";

interface Classes {
    classes: string[];
}

function ClassPanel({ classes }: Classes) {
    const getClassColor = (index: number): string => {
        switch (index) {
            case 0:
                return "#FF0000";
            case 1:
                return "#9370DB";
            case 2:
                return "#00FFFF";
            case 3:
                return "#4169E1";
            case 4:
                return "#FFA500";
            case 5:
                return "#32CD32";
            case 6:
                return "#FF69B4";
            default:
                return "#808080";
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto px-4">
                <div className="flex flex-col gap-2">
                    {classes.map((className, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: getClassColor(index),
                                }}
                            />
                            <span className="text-sm text-white">
                                {className}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ClassPanel;