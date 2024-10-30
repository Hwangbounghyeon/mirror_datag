import { ERROR_MESSAGES } from "@/lib/constants/upload";
import { ValidationResult } from "@/types/upload";

export const createFileInput = ({
    multiple = true,
    accept = "",
    isDirectory = false,
    onChange,
}: {
    multiple?: boolean;
    accept?: string;
    isDirectory?: boolean;
    onChange: (files: File[]) => void;
}) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    input.accept = accept;
    if (isDirectory) {
        input.webkitdirectory = true;
    }

    input.onchange = (e) => {
        const files = Array.from((e.target as HTMLInputElement).files || []);
        onChange(files);
    };

    return input;
};

export const validateFiles = (
    files: File[],
    existingFiles: Array<{ name: string }>,
    currentType: "zip" | "images" | null
): ValidationResult => {
    // 1. 지원하지 않는 파일 타입 체크를 가장 먼저
    const unsupportedFiles = files.filter((file) => {
        const isZip =
            file.type === "application/zip" ||
            file.type === "application/x-zip-compressed";
        const isImage = file.type.startsWith("image/");
        return !isZip && !isImage;
    });

    if (unsupportedFiles.length > 0) {
        return {
            isValid: false,
            error: ERROR_MESSAGES.UNSUPPORTED_TYPE(
                unsupportedFiles.map((f) => f.name)
            ),
        };
    }

    const existingZipFile = existingFiles.some((file) =>
        file.name.toLowerCase().endsWith(".zip")
    );

    // 2. 지원하는 파일들만 분류
    const zipFiles = files.filter(
        (file) =>
            file.type === "application/zip" ||
            file.type === "application/x-zip-compressed"
    );
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    // 3. 중복 파일 체크
    const existingFileNames = new Set(existingFiles.map((img) => img.name));
    const duplicateFiles = files.filter((file) =>
        existingFileNames.has(file.name)
    );

    if (duplicateFiles.length > 0) {
        return {
            isValid: false,
            error: ERROR_MESSAGES.DUPLICATE_FILES(
                duplicateFiles.map((f) => f.name)
            ),
        };
    }

    // 4. 혼합 파일 체크 (currentType 체크 추가)
    if (zipFiles.length > 0 && imageFiles.length > 0) {
        return { isValid: false, error: ERROR_MESSAGES.MIXED_FILES };
    }

    // 5. ZIP 파일 체크
    if (zipFiles.length > 0) {
        if (currentType === "images") {
            return { isValid: false, error: ERROR_MESSAGES.MIXED_FILES };
        }
        if (existingZipFile || zipFiles.length > 1) {
            return { isValid: false, error: ERROR_MESSAGES.MULTIPLE_ZIP };
        }
        return { isValid: true, files: [zipFiles[0]], type: "zip" as const };
    }

    // 6. 이미지 파일 체크
    if (imageFiles.length > 0) {
        if (currentType === "zip") {
            // ZIP 타입이 이미 있는 경우
            return { isValid: false, error: ERROR_MESSAGES.MIXED_FILES };
        }
        return { isValid: true, files: imageFiles, type: "images" as const };
    }

    // 7. 여기까지 왔다면 지원하지 않는 케이스
    return {
        isValid: false,
        error: ERROR_MESSAGES.UNSUPPORTED_TYPE(files.map((f) => f.name)),
    };
};
