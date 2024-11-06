"use client";
import MainAnalysis from "@/components/project/analysis/main-analysis";
import { Suspense } from "react";

interface PageProps {
  params: {
    project_id: string;
  };
  searchParams: {
    history_id?: string;
  };
}

const Page = ({ params, searchParams }: PageProps) => {
  return (
    <Suspense
      key={
        "project_id=" +
        params.project_id +
        "&history_id=" +
        (searchParams.history_id || "")
      }
      fallback={<div>Loading...</div>}
    >
      <MainAnalysis selectedHistory={searchParams.history_id} />
    </Suspense>
  );
};

export default Page;
