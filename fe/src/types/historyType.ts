export type HistoryListData = {
  history_id: string;
  history_name: string;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}

export type HistoryListResponse = {
  data: HistoryListData[];
  page: number;
  limit: number;
  total_count: number;
  total_pages: number;
}