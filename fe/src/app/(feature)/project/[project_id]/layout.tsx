import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <div className="w-full h-[calc(100vh-20px)] min-h-[30rem]">{children}</div>;
};

export default Layout;
