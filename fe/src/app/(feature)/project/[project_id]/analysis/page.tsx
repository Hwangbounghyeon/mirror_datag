import React, { Suspense, useState } from "react";
import { SideHistories } from "@/components/project/analysis/side-histories";
import { HistoryList } from "@/components/project/analysis/history-list";
import MainAnalysis from "@/components/project/analysis/main-analysis";

import { HistoryListData } from "@/types/historyType";

const Page = ({ params }: { params: { project_id: string } }) => {
  return (
    <div className="h-full flex flex-col gap-[1rem] mx-[3rem] pt-[2rem]">
      <div className="w-full h-[3rem] flex justify-between">
        <div className="text-3xl">Analysis</div>
      </div>
      <div className="w-full flex flex-grow">
        <SideHistories projectId={params.project_id}>
          <Suspense fallback={
            <div className="flex-grow bg-red-500 overflow-auto flex items-center justify-center">
              Loading histories...
            </div>
          }>
            {/* <HistoryList projectId={params.project_id} page={page} limit={limit}/> */}
            <HistoryList projectId={params.project_id}/>
          </Suspense>
        </SideHistories>
        <MainAnalysis />
      </div>
    </div>
  );
};

export default Page;