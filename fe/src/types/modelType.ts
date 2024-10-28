export type CategoryId = "object-detection" | "image-classification";

export interface ModelCategory {
  id: "object-detection" | "image-classification";
  title: string;
  description: string;
  image: string;
}

export interface ModelType {
  id: string;
  name: string;
  image: string;
  description: string;
  releaseDate: string;
}
