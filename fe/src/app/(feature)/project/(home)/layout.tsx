import React from "react";

interface LayoutProps {
  project_list: React.ReactNode;
  children: React.ReactNode;
}

const Layout = ({ project_list }: LayoutProps) => {
  return (
    <div className="w-full h-full px-2 py-2">
      <header className="w-full flex flex-row justify-between align-middle items-center px-10 flex-wrap">
        <h1 className="text-[30px] font-bold p-0">Projects</h1>
        <button className="bg-blue-300 font-bold text-[24px] text-white border-none">
          Create Project
        </button>
      </header>
      <div className="flex flex-row flex-wrap">
        <div className="flex flex-row">
          <p>Department</p>
          <select></select>
        </div>
      </div>
    </div>
  );
};

export default Layout;
