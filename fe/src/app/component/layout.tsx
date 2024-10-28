import React from "react";
import Sidebar from "@/components/common/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-row">
      <div>
        <Sidebar />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
