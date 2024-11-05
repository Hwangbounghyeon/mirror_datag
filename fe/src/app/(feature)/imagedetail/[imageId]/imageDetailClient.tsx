"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/imagedeatil/header";
import ClassPanel from "@/components/imagedeatil/classPanel";
import TagPanel from "@/components/imagedeatil/tagPanel";
import ImagePanel from "@/components/imagedeatil/imagePanel";
import { usePanelState } from "@/hooks/imageDetail/usePanelState";
import MetadataPanel from "@/components/imagedeatil/metadataPanel";
import AuthPanel from "@/components/imagedeatil/authPanel";
import { useAuthorityManager } from "@/hooks/imageDetail/useAuthorityManager";
import { useTagManager } from "@/hooks/imageDetail/useTagManager";
import { Authority } from "@/types/auth";

interface ImageDetailClientProps {
    imageId: number;
    initialAuthorities: Authority[];
    initialTags: string[];
    classes: string[];
    imageSrc: string;
    metadata: {
        branch: string;
        process: string;
        location: string;
        equipmentId: string;
        createdAt: Date;
    };
}

function ImageDetailClient({
    imageId,
    initialAuthorities,
    initialTags,
    classes,
    imageSrc,
    metadata,
}: ImageDetailClientProps) {
    const router = useRouter();
    const totalImages = 300;

    const { authorities, addAuthorities, removeAuthority } =
        useAuthorityManager(imageId, initialAuthorities);

    const { tags, addTag, removeTag } = useTagManager(imageId, initialTags);

    const handleNavigate = useCallback(
        (direction: "prev" | "next") => {
            if (direction === "prev" && imageId > 1) {
                router.push(`/imagedetail/${imageId - 1}`);
            } else if (direction === "next" && imageId < totalImages) {
                router.push(`/imagedetail/${imageId + 1}`);
            }
        },
        [imageId, totalImages, router]
    );

    const { activePanel, setActivePanel } = usePanelState();

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-500">
            <Header
                fileName={imageSrc.split("/").pop() || "Unknown"}
                currentNumber={imageId}
                totalCount={totalImages}
                onNavigate={handleNavigate}
            />

            <div className="w-full h-[1px] bg-gray-400 " />
            <div className="flex flex-1 overflow-hidden">
                <div className="w-[20%]">
                    <div className="flex flex-col h-full">
                        <div className="h-1/3 border-b border-gray-700 dark:border-gray-50">
                            <div className="flex px-2 py-2 pb-2 bg-gray-50 dark:bg-gray-500">
                                <div className="flex px-2 py-2 pb-2 bg-gray-50 dark:bg-gray-500">
                                    <div
                                        className={`cursor-pointer px-4 py-1 ${
                                            activePanel === "class"
                                                ? "text-blue-400 border-b-2 border-blue-400"
                                                : "text-gray-400"
                                        }`}
                                        onClick={() => setActivePanel("class")}
                                    >
                                        ClassName
                                    </div>
                                    <div
                                        className={`cursor-pointer px-4 py-1 ${
                                            activePanel === "metadata"
                                                ? "text-blue-400 border-b-2 border-blue-400"
                                                : "text-gray-400"
                                        }`}
                                        onClick={() =>
                                            setActivePanel("metadata")
                                        }
                                    >
                                        MetaData
                                    </div>
                                </div>
                            </div>
                            {activePanel === "class" ? (
                                <ClassPanel classes={classes} />
                            ) : (
                                <MetadataPanel metadata={metadata} />
                            )}
                        </div>
                        <div className="h-1/3 border-b border-gray-700 dark:border-gray-50">
                            <AuthPanel
                                authorities={authorities}
                                onRemove={removeAuthority}
                                onAdd={addAuthorities}
                            />
                        </div>
                        <div className="h-1/3">
                            <TagPanel
                                tags={tags}
                                onRemoveTag={removeTag}
                                onAddTag={addTag}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-[80%]">
                    <ImagePanel imageSrc={imageSrc} />
                </div>
            </div>
        </div>
    );
}

export default ImageDetailClient;
