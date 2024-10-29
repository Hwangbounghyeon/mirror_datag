import Sidebar from "@/components/common/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen min-w-screen flex flex-row">
      <div className="h-full">
        <Sidebar />
      </div>
      <section className="flex-grow  h-full">{children}</section>
    </div>
  );
};

export default Layout;
