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
    endpoint: `/project/history/${projectId}/list`,
    searchParams: requestParams,
  });

  if (!response.data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="p-6 text-center bg-default-50 rounded-lg">
          <p className="text-lg font-medium">데이터가 없습니다</p>
        </div>
      </div>
    );
  }

  const result = response.data;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-background shadow-lg rounded-lg p-6">
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">분석 히스토리</h1>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          {result.data.data.map((history) => (
            <HistoryCard
              key={history.history_id}
              project_id={projectId}
              {...history}
              queryStrings={requestParams}
            />
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-divider">
          <PaginationBar
            prefetch={false}
            queryStrings={requestParams}
            totalPage={result.data.total_pages}
            currentPage={page > result.data.total_pages ? result.data.total_pages : page}
          />
        </div>
      </div>
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
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-4 bg-default-50 rounded-lg">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <GetHistories
        projectId={projectId}
        nowPage={nowPage}
        searchParams={queryStrings}
      />
    </Suspense>
  );
};

export default Page;
