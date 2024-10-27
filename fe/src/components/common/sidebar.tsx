import { AiFillDatabase } from "react-icons/ai";
import { FaPeopleRoof } from "react-icons/fa6";
import SidebarItem from "./sidebar-item";
import { FaUser } from "react-icons/fa";

const dummyItemList = [
  {
    title: "DataSet",
    icon: AiFillDatabase,
    link: "/dataset",
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
  return (
    <div className="w-64 min-h-screen bg-slate-100 dark:bg-black border-r-2 border-r-slate-300 dark:border-r-[#1e1e1e] flex flex-col items-center">
      <header className="mt-3 mb-3">Header</header>
      <section></section>
      <section className="mt-3">
        {dummyItemList.map((item) => (
          <SidebarItem key={item.title} title={item.title} Icon={item.icon} />
        ))}
      </section>
    </div>
  );
};

export default Sidebar;
