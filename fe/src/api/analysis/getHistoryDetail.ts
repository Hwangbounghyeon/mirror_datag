import { customFetch } from "@/app/actions/customFetch";
import { HistoryDetailResponseType } from "@/types/historyType";

export async function getHistoryDetail(historyId: string) {
  return await customFetch<HistoryDetailResponseType>({
    method: "GET",
    cache: "no-store",
    ContentType: "application/json",
    endpoint: `/history/detail/${historyId}`
  });
}