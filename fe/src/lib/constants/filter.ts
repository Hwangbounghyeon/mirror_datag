export const FILTER_OPTIONS = [
    "All",
    "Labeled",
    "Unlabeled",
    "Verified",
    "Unverified",
] as const;

export type FilterOption = (typeof FILTER_OPTIONS)[number];
