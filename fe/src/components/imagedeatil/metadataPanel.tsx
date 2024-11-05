import React from "react";

interface MetadataPanelProps {
    metadata: {
        branch: string;
        process: string;
        location: string;
        equipmentId: string;
        createdAt: Date;
    };
}

function MetadataPanel({ metadata }: MetadataPanelProps) {
    return (
        <div className="flex flex-col px-4">
            <div className="flex flex-col gap-2">
                <div>Branch: {metadata.branch}</div>
                <div>Process: {metadata.process}</div>
                <div>Location: {metadata.location}</div>
                <div>Equipment ID: {metadata.equipmentId}</div>
                <div>Created At: {metadata.createdAt.toString()}</div>
            </div>
        </div>
    );
}

export default MetadataPanel;
