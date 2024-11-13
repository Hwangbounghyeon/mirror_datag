import React, { Suspense } from "react";
import ProjectItem from "@/components/project/project-item";
import { ProjectRequest, ProjectType } from "@/types/projectType";
import { getProjects } from "@/api/project/getProjects";

const ProjectList = async ({
  searchParams
}: {
  searchParams: ProjectRequest;
}) => {
  const response = await getProjects(searchParams);

  if (!response.data) {
    return (
      <div className="w-full flex flex-col items-center flex-grow mt-5">
        프로젝트가 존재하지 않습니다.
      </div>
    )
  }

  const projects: ProjectType[] = response.data.data

  return (
    <div className="w-full flex flex-col items-center flex-grow mt-5">
      {projects.map((project) => (
        <ProjectItem key={project.project_id} project={project} />
      ))}
    </div>
  );
};

interface PageProps {
  searchParams: {
    page?: string;
    model_name?: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  const nowPage = searchParams.page ? searchParams.page : "1";
  const searchRequest = {
    page: nowPage,
    limit: "10",
    ...(searchParams.model_name && { model_name: searchParams.model_name })
  }
  return (
    <div className="overflow-y-scroll bg-slate-100 dark:bg-gray-700 py-2 px-2 my-3 rounded-md w-full h-full flex flex-col items-center flex-grow remove_scrollbar">
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectList searchParams={searchRequest}/>
      </Suspense>
    </div>
  );
};

export default Page;
