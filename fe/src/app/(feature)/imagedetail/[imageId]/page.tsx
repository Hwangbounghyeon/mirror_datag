"use client";

import React, { useCallback, useEffect } from "react";
import Header from "./../../../../components/imagedeatil/header";
import ClassPanel from "@/components/imagedeatil/classPanel";
import TagPanel from "@/components/imagedeatil/tagPanel";
import ImagePanel from "@/components/imagedeatil/imagePanel";
import { useItemManager } from "@/hooks/imageDetail/useItemManager";
import { useParams, useRouter } from "next/navigation";
import { usePanelState } from "@/hooks/imageDetail/usePanelState";
import MetadataPanel from "@/components/imagedeatil/metadataPanel";
import AuthPanel from "@/components/imagedeatil/authPanel";
import { Authority, Tag } from "@/types/auth";

function ImageDetailPage() {
    const router = useRouter();
    const params = useParams();
    const currentImageId = Number(params.imageId);
    const totalImages = 300;
    const classes = ["Dog", "Cat"];

    const {
        items: tags,
        addItem: addTag,
        removeItem: removeTag,
    } = useItemManager<Tag>([
        { id: 1, tag: "Dog" },
        { id: 2, tag: "Animal" },
        { id: 3, tag: "cat" },
    ]);

    const {
        items: authorities,
        addItems: addAuthorities,
        removeItem: removeAuthority,
    } = useItemManager<Authority>([
        { id: 11, name: "홍길동", department: "AA 부서" },
        { id: 12, name: "홍길동", department: "BB 부서" },
        { id: 13, name: "홍길동", department: "CC 부서" },
        { id: 14, name: "홍길동", department: "DD 부서" },
        { id: 15, name: "홍길동", department: "EE 부서" },
        { id: 16, name: "홍길동", department: "FF 부서" },
    ]);

    const handleNavigate = useCallback(
        (direction: "prev" | "next") => {
            if (direction === "prev" && currentImageId > 1) {
                router.push(`/imagedetail/${currentImageId - 1}`);
            } else if (direction === "next" && currentImageId < totalImages) {
                router.push(`/imagedetail/${currentImageId + 1}`);
            }
        },
        [currentImageId, totalImages, router]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" && currentImageId > 1) {
                handleNavigate("prev");
            } else if (e.key === "ArrowRight" && currentImageId < totalImages) {
                handleNavigate("next");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentImageId, handleNavigate, totalImages]);

    const { activePanel, setActivePanel } = usePanelState();

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-500">
            <Header
                fileName="dog.png"
                currentNumber={currentImageId}
                totalCount={totalImages}
                onNavigate={handleNavigate}
            />

            <div className="w-full h-[1px] bg-gray-400 " />
            <div className="flex flex-1 overflow-hidden">
                <div className="w-[20%]">
                    <div className="flex flex-col h-full">
                        <div className="h-1/3 border-b border-gray-700">
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
                                    className={`cursor-pointer px-4 py-1  ${
                                        activePanel === "metadata"
                                            ? "text-blue-400 border-b-2 border-blue-400"
                                            : "text-gray-400"
                                    }`}
                                    onClick={() => setActivePanel("metadata")}
                                >
                                    MetaData
                                </div>
                            </div>

                            {activePanel === "class" ? (
                                <ClassPanel classes={classes} />
                            ) : (
                                <MetadataPanel />
                            )}
                        </div>
                        <div className="h-1/3 border-b border-gray-700">
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
                                onAddTag={(newTag) => {
                                    const newTagObj: Tag = {
                                        id:
                                            Math.max(
                                                0,
                                                ...tags.map((t) => t.id)
                                            ) + 1,
                                        tag: newTag,
                                    };
                                    addTag(newTagObj);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-[80%]">
                    <ImagePanel imageSrc="/images/yolo-v5.png" />
                </div>
            </div>
        </div>
    );
}

export default ImageDetailPage;
