// history-card.tsx
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

  const getStatusBadge = (isDone: number) => {
    const statusConfig = {
      0: { color: "bg-warning-100 text-warning-700", text: "분석중" },
      1: { color: "bg-success-100 text-success-700", text: "완료됨" },
      2: { color: "bg-danger-100 text-danger-700", text: "실패" },
    };

    const status = statusConfig[isDone as keyof typeof statusConfig] || statusConfig[0];

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
        {status.text}
      </span>
    );
  };

  return (
    <Link
      prefetch={prefetch}
      href={`/project/${project_id}/analysis?${searchParams.toString()}`}
      className="block transition-all duration-200 hover:translate-x-1"
    >
      <div className="p-4 bg-content2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-foreground">
            {history_name}
          </h3>
          <div className="flex justify-between items-center">
            <time className="text-sm text-foreground-500">
              {updated_at}
            </time>
            {getStatusBadge(is_done)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HistoryCard;