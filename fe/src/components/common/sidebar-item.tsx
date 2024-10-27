import { IconType } from "react-icons";
import Link from "next/link";

interface SidebarItemProps {
  title: string;
  Icon: IconType;
  link?: string;
}

const SidebarItem = ({ title, Icon, link }: SidebarItemProps) => {
  return (
    <Link href={link || "/"}>
      <div className="w-full mt-1 mb-1 h-[50px] border-blue-300 border-b-2 border-b-slate-300 dark:border-b-slate-300 flex flex-row items-center transition-all hover:scale-105 active:scale-95">
        <Icon size={30} />
        <div className="mx-3 text-[20px]">{title}</div>
      </div>
    </Link>
  );
};

export default SidebarItem;
