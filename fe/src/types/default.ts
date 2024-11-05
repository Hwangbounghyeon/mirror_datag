export type DefaultResponseType<T> = {
  status: number;
  data?: T;
  error?: string;
};

// 모든 응답에 대해서 return해야 하는 타입
