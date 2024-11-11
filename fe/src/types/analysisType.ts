export type ConditionType = {
    andCondition: string[];
    orCondition: string[];
    notCondition: string[];
};

export type AnalysisRequestType = {
    algorithm: string;
    project_id: string;
    history_name: string;
    is_private: boolean;
    selected_tags: ConditionType[]
    image_ids: string[]
};