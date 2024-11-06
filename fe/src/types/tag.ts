import { DefaultResponseType } from "./default";

export interface TagRequest {
    image_id: string;
    tag_name: string;
}

interface TagResponseData {
    image_id: string;
    tag_name_list: string[];
}

export type AddTagResponse = DefaultResponseType<TagResponseData>;
