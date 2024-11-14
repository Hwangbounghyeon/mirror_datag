"use client";

import React from "react";
import ReduxProvider from "@/components/common/redux-provider";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-full">
      <ReduxProvider>{children}</ReduxProvider>
    </div>
  );
};

export default Layout;
