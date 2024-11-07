import PaginationBar from "@/components/common/pagination";
import HistoryCard from "@/components/project/analysis/history-card";
import { customFetch } from "@/app/actions/customFetch";
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
  const response = await customFetch<HistoryResponseType>({
    method: "GET",
    cache: "no-store",
    ContentType: "application/json",
    endpoint: `/history/${projectId}`,
    searchParams: requestParams,
  });
  console.log("abcd", response);
  if (!response.data) {
    return <div>데이터가 없습니다.</div>;
  }
  const result = response.data;
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
