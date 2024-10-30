import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface HeaderProps {
    fileName: string;
    currentNumber: number;
    totalCount: number;
}

function Header({ fileName, currentNumber, totalCount }: HeaderProps) {
    return (
        <div className="w-full flex items-center relative">
            <div className="flex flex-col px-2">
                <p className="pb-1">
                    <FaArrowLeftLong />
                </p>
                <span>{fileName}</span>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center">
                <IoIosArrowBack />
                <span className="mx-2">{`${currentNumber}/${totalCount}`}</span>
                <IoIosArrowForward />
            </div>
        </div>
    );
}

export default Header;
