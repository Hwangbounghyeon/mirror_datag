"use client";

import { AiFillDatabase } from "react-icons/ai";
import { FaPeopleRoof } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import SidebarItem from "./sidebar-item";
import dynamic from "next/dynamic";
import { useState } from "react";

const ThemeSelect = dynamic(() => import("@/components/common/theme-select"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const dummyItemList = [
  {
    title: "Project",
    icon: AiFillDatabase,
    link: "/project",
  },
  {
    title: "Department",
    icon: FaPeopleRoof,
    link: "/department",
  },
  {
    title: "Users",
    icon: FaUser,
    link: "/users",
  },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Hover trigger area */}
      <div
        className="fixed left-0 top-0 w-2 h-screen z-40"
        onMouseEnter={() => setIsExpanded(true)}
      />

      {/* Sidebar */}
      <aside
        className={`z-50 fixed top-0 left-0 h-screen px-3 py-3 bg-slate-100 dark:bg-black border-r-2 border-r-slate-300 dark:border-r-[#1e1e1e] flex flex-col items-center transition-all duration-300 ease-in-out
          ${isExpanded ? "w-64 translate-x-0" : "w-64 -translate-x-64"}`}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <header className="mt-3 mb-3">Header</header>
        <section className="mt-3 w-full">
          {dummyItemList.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              Icon={item.icon}
              link={item.link}
            />
          ))}
        </section>
        <section className="absolute bottom-5">
          <ThemeSelect />
        </section>
      </aside>

      {/* Toggle Button - Now at bottom left */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed bottom-4 z-50 bg-slate-100 dark:bg-black p-2 rounded-r-lg border-y-2 border-r-2 border-slate-300 dark:border-[#1e1e1e] transition-all duration-300 ease-in-out hover:bg-slate-200 dark:hover:bg-zinc-900
          ${isExpanded ? "left-64" : "left-0"}`}
        aria-label={isExpanded ? "Close sidebar" : "Open sidebar"}
      >
        {isExpanded ? (
          <IoIosArrowBack className="text-xl" />
        ) : (
          <IoIosArrowForward className="text-xl" />
        )}
      </button>
    </>
  );
};

export default Sidebar;
