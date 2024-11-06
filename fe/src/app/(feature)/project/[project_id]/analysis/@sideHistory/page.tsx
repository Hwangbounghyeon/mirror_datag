import PaginationBar from "@/components/common/pagination";
import HistoryCard from "@/components/project/analysis/history-card";
import { HistoryResponseType } from "@/types/historyType";
import { Suspense } from "react";

const GetHistories = async ({
  projectId,
  nowPage,
  searchParams,
}: {
  projectId: string;
  searchParams?: URLSearchParams;
  nowPage?: number;
}) => {
  const page = nowPage ? nowPage : 1;
  const requestParams = new URLSearchParams(searchParams);
  requestParams.set("page", page.toString());
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/history/${projectId}?${requestParams.toString()}`,
    {
      headers: {
        Authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJlbWFpbCI6IjU1MTYyMzdAa211LmtyIiwiZGVwYXJ0bWVudF9pZCI6MSwiaXNfc3VwZXJ2aXNlZCI6dHJ1ZSwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImV4cCI6MTczMDg5MzkzOX0.asRcUQvBAr5NoLSXnu7kxabQL4mW5uiNKvtvj2gMHi0`,
      },
      cache: "no-store",
    }
  );
  const result: HistoryResponseType = await response.json();
  return (
    <div className="h-full w-full flex flex-col flex-grow items-center">
      <div className="h-[85%] w-[95%] flex flex-col overflow-y-scroll">
        {result.data.data.map((history) => (
          <HistoryCard
            key={history.history_id}
            project_id={projectId}
            {...history}
            queryStrings={requestParams}
          />
        ))}
      </div>
      <PaginationBar
        prefetch={false}
        queryStrings={requestParams}
        totalPage={result.data.total_pages}
        currentPage={
          page > result.data.total_pages ? result.data.total_pages : page
        }
      />
    </div>
  );
};

interface PageProps {
  params: {
    // 동적변수
    project_id: string;
  };
  searchParams: {
    // 쿼리스트링
    page?: string;
    history_id?: string;
  };
}

const Page = ({ params, searchParams }: PageProps) => {
  const projectId = params.project_id;
  const nowPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const queryStrings = new URLSearchParams(searchParams);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GetHistories
        projectId={projectId}
        nowPage={nowPage}
        searchParams={queryStrings}
      />
    </Suspense>
  );
};

export default Page;
