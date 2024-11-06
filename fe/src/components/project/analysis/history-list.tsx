import PaginationBar from "@/components/common/pagination";
import HistoryCard from "@/components/project/analysis/history-card";
import { HistoryResponseType } from "@/types/historyType";

const GetHistories = async ({
  projectId,
  nowPage,
}: {
  projectId: string;
  requestParams?: URLSearchParams;
  nowPage?: number;
}) => {
  const page = nowPage ? nowPage : 1;
  const requestParams = new URLSearchParams({
    page: page.toString(),
  });
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
      <div className="h-[90%] w-[95%] flex flex-col overflow-y-scroll">
        {result.data.data.map((history) => (
          <HistoryCard
            key={history.history_id}
            project_id={projectId}
            {...history}
          />
        ))}
      </div>
      <PaginationBar
        totalPage={result.data.total_pages}
        currentPage={
          page > result.data.total_pages ? result.data.total_pages : page
        }
      />
    </div>
  );
};
