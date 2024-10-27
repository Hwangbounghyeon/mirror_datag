"use client";

import Sidebar from "@/components/common/sidebar";
import React from "react";

const Page = () => {
  return (
    <section className="flex flex-row justify-center">
      <div className="w-[30%]">
        <Sidebar></Sidebar>
      </div>

      <div className="flex flex-col justify-center align-middle items-center w-full">
        <h1 className="mt-3 text-[30px]">Component Page</h1>

        <div className="flex flex-col justify-center align-middle items-center">
          <p>Button</p>
          <button>Button Default</button>
          <p>globals.css 에 적용된 상태</p>
        </div>
      </div>
    </section>
  );
};

export default Page;
