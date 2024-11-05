'use client';
import React from "react";
import { HistoryListData } from "@/types/historyType";

interface SideHistoriesProps {
  projectId: string;
  children: React.ReactNode;
}

export function SideHistories({ projectId, children }: SideHistoriesProps) {
  return (
    <div className="w-[17%] min-w-[15rem] me-[3%] h-[85vh] min-h-[40rem] sticky top-[3rem] flex flex-col bg-gray-300">
      <div className="w-full h-[3rem] bg-yellow-300">
        title
      </div>
      {children}
    </div>
  );
}