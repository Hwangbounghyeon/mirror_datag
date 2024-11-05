
import React from "react";
import FloatingButton from "@/components/project/floating-button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-full h-[calc(100vh-20px)] min-h-[30rem]">
      {children}
      <FloatingButton />
    </div>
  );
};

export default Layout;
