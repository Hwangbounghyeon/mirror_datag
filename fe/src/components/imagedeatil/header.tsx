import { useRouter } from "next/navigation";
import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface HeaderProps {
    fileName: string;
    currentNumber: number;
    totalCount: number;
    onNavigate: (direction: "prev" | "next") => void;
}

function Header({
    fileName,
    currentNumber,
    totalCount,
    onNavigate,
}: HeaderProps) {
    const router = useRouter();
    const isFirstPage = currentNumber === 1;
    const isLastPage = currentNumber === totalCount;

    return (
        <div className="w-full flex items-center relative pb-2 bg-gray-50 dark:bg-gray-500">
            <div
                className="flex flex-col px-2 cursor-pointer"
                onClick={() => router.push("/dataset")}
            >
                <p className="pb-1">
                    <FaArrowLeftLong />
                </p>
                <span>{fileName}</span>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center">
                <div className="flex items-center justify-center w-40">
                    {isFirstPage ? (
                        <div className="w-8" />
                    ) : (
                        <button
                            onClick={() => onNavigate("prev")}
                            className="w-8 p-1 hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <IoIosArrowBack size={24} />
                        </button>
                    )}
                    <span className="mx-2 w-16 text-center">{`${currentNumber} / ${totalCount}`}</span>
                    {isLastPage ? (
                        <div className="w-8" />
                    ) : (
                        <button
                            onClick={() => onNavigate("next")}
                            className="w-8 p-1 hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <IoIosArrowForward size={24} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
