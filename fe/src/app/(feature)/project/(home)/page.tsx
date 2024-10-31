import React, { Suspense } from "react";
import ProjectItem from "@/components/project/project-item";
import { getProjects } from "@/lib/constants/projects";

interface PageProps {
  searchParams: {
    department_id?: string;
    model_name?: string;
  };
}

const ProjuectList = async () => {
  const projects = await getProjects();
  return (
    <div className="w-full flex flex-col items-center flex-grow mt-5">
      {projects.map((project) => (
        <ProjectItem key={project.project_id} project={project} />
      ))}
    </div>
  );
};

const Page = ({ searchParams }: PageProps) => {
  return (
    <div className="overflow-y-scroll bg-slate-100 dark:bg-gray-700 py-2 px-2 my-3 rounded-md w-full h-full flex flex-col items-center flex-grow remove_scrollbar">
      <Suspense fallback={<div>Loading...</div>}>
        <ProjuectList />
      </Suspense>
    </div>
  );
};

export default Page;
