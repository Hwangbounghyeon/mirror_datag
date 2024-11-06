import Image from "next/image";
import React from "react";

interface ImagePanelProps {
    imageSrc: string;
}

function ImagePanel({ imageSrc }: ImagePanelProps) {
    return (
        <div className="h-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-600">
            <div className="rounded-lg overflow-hidden min-h-[600px] min-w-[600px] relative">
                <Image
                    src={imageSrc}
                    fill
                    alt="No Image"
                    sizes="(min-width: 400px) 100vw, 300px"
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}

export default ImagePanel;
