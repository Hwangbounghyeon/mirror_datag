import React from "react";
import Link from "next/link";

interface LayoutProps {
  options: React.ReactNode;
  children: React.ReactNode;
}

const Layout = ({ options, children }: LayoutProps) => {
  return (
    <div className="w-full min-h-[95vh] flex flex-col border border-red-600 items-center">
      <header className="w-full flex flex-row justify-between align-middle items-center flex-wrap">
        <h1 className="text-[30px] font-bold p-0">Projects</h1>

        <Link
          href={"../create"}
          className="bg-blue-300 font-bold text-[24px] text-white border-none rounded-md px-2 py-1"
        >
          Create Project
        </Link>
      </header>
      <div className="w-full mt-5">{options}</div>
      {children}
    </div>
  );
};

export default Layout;
