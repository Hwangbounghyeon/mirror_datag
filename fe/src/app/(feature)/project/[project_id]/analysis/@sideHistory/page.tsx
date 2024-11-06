import HistoryCard from "@/components/project/analysis/history-card";
import { HistoryListResponse } from "@/types/historyType";
import React, { Suspense } from "react";

const GetHistories = async ({
  projectId,
  requestParams,
}: {
  projectId: string;
  requestParams?: URLSearchParams;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/history/${projectId}?${
      requestParams ? requestParams.toString() : ""
    }`,
    {
      headers: {
        Authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJlbWFpbCI6IjU1MTYyMzdAa211LmtyIiwiZGVwYXJ0bWVudF9pZCI6MSwiaXNfc3VwZXJ2aXNlZCI6dHJ1ZSwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImV4cCI6MTczMDg5MzkzOX0.asRcUQvBAr5NoLSXnu7kxabQL4mW5uiNKvtvj2gMHi0`,
      },
      cache: "no-store",
    }
  );
  const result = await response.json();
  const data: HistoryListResponse = result.data;
  return (
    <div className="overflow-y-scroll">
      {data.data.map((history) => (
        <HistoryCard
          key={history.history_id}
          project_id={projectId}
          {...history}
        />
      ))}
    </div>
  );
};

interface PageProps {
  params: {
    project_id: string;
  };
}

const Page = ({ params }: PageProps) => {
  return (
    <Suspense key={params.project_id} fallback={<div>Loading...</div>}>
      <GetHistories projectId={params.project_id} />
    </Suspense>
  );
};

export default Page;
