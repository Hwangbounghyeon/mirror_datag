import Sidebar from "@/components/common/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen h-full min-w-screen flex flex-row">
      <Sidebar />
      <section style={{ flex: 1, padding: "10px" }}>{children}</section>
    </div>
  );
};

export default Layout;
