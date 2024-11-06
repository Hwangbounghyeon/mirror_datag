import React from "react";

interface LayoutProps {
  sideHistory: React.ReactNode;
  children: React.ReactNode;
}

const Layout = ({ sideHistory, children }: LayoutProps) => {
  return (
    <div className="w-full h-screen flex flex-col min-h-[30rem]">
      <div className="w-full h-[3rem] flex justify-between">
        <div className="text-3xl mt-3 ml-3">Analysis</div>
      </div>
      <div className="flex flex-row flex-grow">
        <div className="w-[17%] min-w-[15rem] me-[3%] h-[85vh] min-h-[40rem] sticky rounded-md top-[3rem] flex flex-col bg-red-300">
          <div className="w-full h-[3rem] bg-yellow-300 mb-3">title</div>
          {sideHistory}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
