export type HistoryListData = {
  history_id: string;
  history_name: string;
  is_done: boolean;
  created_at: string;
  updated_at: string;
};

export type HistoryListResponse = {
  data: HistoryListData[];
  page: number;
  limit: number;
  total_count: number;
  total_pages: number;
};

export type HistoryResponseType = {
  status: number;
  data: {
    data: HistoryListData[];
    page: number;
    limit: number;
    total_count: number;
    total_pages: number;
  };
};

export type Parameters = {
  selectedAlgorithm: string;
  selectedTags: string[][];
}

export type ClassificationPredictions = {
  prediction: string;
  confidnence: number;
} 

export type ObjectDetectionPredictions = {
  prediction: string;
  confidnence: number;
  threshold: number;
  bbox: number[];
}

export type ReductionResults = {
  imageId: string;
  features: number[];
  predictions: ClassificationPredictions | ObjectDetectionPredictions;
}

export type HistoryData = {
  userId: number;
  projectId: string;
  isPrivate: boolean;
  historyName: string;
  isDone: boolean;
  parameters?: Parameters;
  results?: ReductionResults[];
  createdAt: Date;
  updatedAt: Date;
}