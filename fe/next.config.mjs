/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["picsum.photos", "ssafy-project.s3.us-east-2.amazonaws.com"],
    },
    // 정적 생성 비활성화
    output: 'standalone',
    experimental: {
        // 실험적 기능 설정
        serverActions: true,
    },
    // 빌드 시 API 호출 타임아웃 설정
    staticPageGenerationTimeout: 120,
    // 빌드 시 타입 체크 비활성화
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
