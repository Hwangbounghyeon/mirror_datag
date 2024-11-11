import React, { useEffect, useRef } from "react";
import { Detection } from "@/types/metadata";

interface ImagePanelProps {
    imageSrc: string;
    detections?: Detection[];
}

function ImagePanel({ imageSrc, detections }: ImagePanelProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            if (detections && detections.length > 0) {
                detections.forEach((detection) => {
                    const [x1, y1, x2, y2] = detection.bbox;

                    const width = x2 - x1;
                    const height = y2 - y1;

                    ctx.strokeStyle = "#00FF00";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x1, y1, width, height);

                    ctx.fillStyle = "#00FF00";
                    ctx.font = "16px Arial";
                    const label = `${detection.prediction} ${(
                        detection.confidence * 100
                    ).toFixed(1)}%`;
                    ctx.fillText(label, x1, y1 - 5);
                });
            }
        };
    }, [imageSrc, detections]);

    return (
        <div className="h-full w-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-600">
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                    }}
                />
            </div>
        </div>
    );
}

export default ImagePanel;
