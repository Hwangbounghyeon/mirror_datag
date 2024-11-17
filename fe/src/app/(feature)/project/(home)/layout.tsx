import React from "react";
import Link from "next/link";

interface LayoutProps {
    options: React.ReactNode;
    children: React.ReactNode;
}

const Layout = ({ options, children }: LayoutProps) => {
    return (
        <div className="w-full flex flex-col items-center overflow-hidden px-2 mt-2">
            <header className="w-full flex flex-row justify-between align-middle items-center flex-wrap">
                <h1 className="text-[30px] font-bold p-0">Projects</h1>

                <Link
                    href={"/project/create"}
                    className="bg-blue-800 font-bold text-[18px] text-white border-none rounded-md px-5 py-3"
                >
                    + Create Project
                </Link>
            </header>
            <div className="w-full mt-5">{options}</div>
            {children}
        </div>
    );
};

export default Layout;
