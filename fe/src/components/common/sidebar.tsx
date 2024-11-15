"use client";

import { AiFillDatabase } from "react-icons/ai";
import { FaPeopleRoof } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import SidebarItem from "./sidebar-item";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { RiLoader2Fill } from "react-icons/ri";
import { MdCloudUpload } from "react-icons/md";
import { userState } from "@/store/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Spinner } from "@nextui-org/react";
import { fetchUserProfile } from "@/store/user";
import { useUserDispatch, useUserSelector } from "@/hooks/userProfileHook";

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
  {
    title: "Load Image",
    icon: RiLoader2Fill,
    link: "/loadimage",
  },
  {
    title: "Upload",
    icon: MdCloudUpload,
    link: "/upload",
  },
];

const Sidebar = () => {
  const dispatch = useUserDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const isLoading = useSelector((state: userState) => state.user.loading);
  const profile = useSelector((state: userState) => state.user.profile);
  const error = useSelector((state: userState) => state.user.error);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!profile) {
          dispatch(fetchUserProfile());
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchData();
  }, []);

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log("Current state:", { isLoading, profile, error });
  }, [isLoading, profile, error]);
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
        <header className="mt-3 mb-3">
          <div className="w-[90%] h-[100px] rounded-sm flex flex-col items-center border-red-200 border-2">
            {isLoading ? (
              <Spinner color="primary" />
            ) : profile ? (
              <div>
                <p>{profile?.name}</p>
              </div>
            ) : (
              <div>
                <p>{error}</p>
              </div>
            )}
            <p>header</p>
          </div>
        </header>
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
