import React, { Suspense } from "react";
import ProjectItem from "@/components/project/project-item";

const mockUpProjectData = [];

interface PageProps {
  searchParams: {
    department_id?: string;
    model_name?: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  return (
    <div className="w-full flex flex-col items-center flex-grow mt-5 border-2 border-red-300 px-5 py-5">
      <section className="flex flex-row w-full items-center flex-wrap border border-blue-900">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectItem />
          <ProjectItem />
        </Suspense>
      </section>
    </div>
  );
};

export default Page;
