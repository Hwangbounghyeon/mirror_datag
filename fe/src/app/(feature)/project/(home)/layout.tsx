import React from "react";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center px-2 py-2">
      <header className="w-full flex flex-row justify-between align-middle items-center px-10 flex-wrap">
        <h1 className="text-[30px] font-bold p-0">Projects</h1>

        <Link
          href={"../create"}
          className="bg-blue-300 font-bold text-[24px] text-white border-none rounded-md px-2 py-1"
        >
          Create Project
        </Link>
      </header>
      <div className="w-full mt-5">{children}</div>
    </div>
  );
};

export default Layout;
