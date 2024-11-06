"use client";
import React, { useState, useEffect } from "react";
import SideHistories from "@/components/project/analysis/side-histories";
import MainAnalysis from "@/components/project/analysis/main-analysis";

import { HistoryListData } from "@/types/historyType";

const Page = ({ params }: { params: { project_id: string } }) => {
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col gap-[1rem] mx-[3rem] pt-[2rem]">
      <div className="w-full h-[3rem] flex justify-between">
        <div className="text-3xl">Analysis</div>
      </div>
      <div className="w-full flex flex-grow">
        <SideHistories projectId={params.project_id} setSelectedHistory={setSelectedHistory}/>
        <MainAnalysis selectedHistory={selectedHistory}/>
      </div>
    </div>
  );
};

export default Page;