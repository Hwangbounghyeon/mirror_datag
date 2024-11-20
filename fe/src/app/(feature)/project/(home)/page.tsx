import dynamic from "next/dynamic";
const ProjectList = dynamic(() => import("@/components/project/project-list"), {
  ssr: false,
});

const Page = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-2 px-2 my-3 rounded-md w-full flex flex-col items-center flex-grow remove_scrollbar overflow-x-scroll">
      <ProjectList />
    </div>
  );
};

export default Page;
