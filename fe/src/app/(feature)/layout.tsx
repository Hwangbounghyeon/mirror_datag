import Sidebar from "@/components/common/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen min-w-screen flex">
      <Sidebar />
      <main className="flex-1">
        <div className="px-5 ">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
