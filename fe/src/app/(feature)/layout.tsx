import Sidebar from "@/components/common/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen min-w-screen flex flex-row ">
      <Sidebar />
      <section style={{ flex: 1, marginLeft: "10px", marginRight: "10px" }}>
        {children}
      </section>
    </div>
  );
};

export default Layout;
