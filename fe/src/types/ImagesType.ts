import { FilterRow } from "@/components/loadimage/filterBox";

export type ImagesType = {
  id: string;
  imageUrl: string;
  checked: boolean;
};

export type ImageListResponse = {
  images: Record<string, string>;
};

export type SearchCondition = {
  and_condition: string[];
  or_condition: string[];
  not_condition: string[];
};

export type SearchRequest = {
  page?: number;
  limit?: number;
  conditions?: SearchCondition[];
};