import React from "react";

interface ImagePanelProps {
    imageSrc: string;
}

function ImagePanel({ imageSrc }: ImagePanelProps) {
    return (
        <div className="h-full flex items-center justify-center p-4">
            <div className="relative w-full h-full flex items-center justify-center">
                <img src={imageSrc} className="w-auto h-auto" />
            </div>
        </div>
    );
}

export default ImagePanel;
