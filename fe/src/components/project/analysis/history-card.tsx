import { HistoryListData } from "@/types/historyType";
import Link from "next/link";

interface HistoryCardProps extends HistoryListData {
  project_id: string;
  queryStrings?: URLSearchParams;
  prefetch?: boolean | null;
}

const HistoryCard = ({
  project_id,
  history_id,
  history_name,
  is_done,
  created_at,
  updated_at,
  prefetch = null,
  queryStrings,
}: HistoryCardProps) => {
  const searchParams = new URLSearchParams(queryStrings);
  searchParams.set("history_id", history_id);
  return (
    <Link
      prefetch={prefetch}
      href={`/project/${project_id}/analysis?${searchParams.toString()}`}
      key={history_id}
      className="flex flex-col bg-gray-300 mb-[1rem] cursor-pointer"
    >
      <div>{history_name}</div>
      <div className="flex justify-between">
        <div className="truncate w-[60%]">{updated_at}</div>
        <div className="w-[25%]">{is_done ? "완료됨" : "분석중"}</div>
      </div>
    </Link>
  );
};

export default HistoryCard;
