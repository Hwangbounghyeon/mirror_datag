import { DefaultResponseType } from "./default";

export interface AddTagRequest {
    image_id: string;
    tag_list: string[];
}

export interface DeleteTagRequest {
    image_id: string;
    delete_tag_list: string[];
}

interface TagResponseData {
    image_id: string;
    tag_name_list: string[];
}

export type TagResponse = DefaultResponseType<TagResponseData>;
