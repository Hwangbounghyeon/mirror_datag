# Gitlab 소스 클론 이후 빅드 및 배포할 수 있도록 정리한 문서

1. 사용한 JVM, 웹서버, WAS 제품 등의 종류와 설정 값, 버전(IDE버전 포함)기재
2. 빌드 시 사용되는 환경 변수 등의 내용 상세 기재
3. 배포 시 특이사항 기재
4. DB접속 정보 등 프로젝트(ERD)에 활용되는 주요 계정 및 프로퍼티가 정의된 파일 목록

## 사용도구

- 이슈 관리 : Jira
- 형상 관리 : GitLab
- 커뮤니케이션 : Notion, MatterMost
- 디자인 : Figma
- CI/CD : Jenkins

## 개발도구

- Backend
  - Visual Studio Code : 1.93
- frontend
  - Visual Studio Code : 1.93

## 개발환경

**BackEnd**
| 언어 | 버전 |
| --- | --- |
| Python | 3.11.8 |
| FastAPI | 0.114.1 |

**FrontEnd**
|언어|버전|
|------|---|
|React|1.9|
|Next.js|1.9|

### Database

| 언어    | 버전  |
| ------- | ----- |
| MariaDB | 8.10  |
| MongoDB | 7.2.1 |

### Infra

| 언어    | 버전      |
| ------- | --------- |
| Jenkins | 2.477     |
| Nginx   | 1.25.2    |
| Ec2     | 2.3.978.0 |
| S3      |           |

## EC2 포트번호

- Backend(API, DL) : 8080
- Frontend : 3000
- nginx : 80
- Redis : 6379
- Jenkins : 8080

# 프로젝트에서 사용하는 외부 서비스 정보를 정리한 문서

| 소셜 인증, 포톤 클라우드, 코드 컴파일 등에 활용 된 '외부 서비스'가입 및 활용에 필요한 정보

# DB 덤프 파일 최신본

[MariaDB](./S108.sql)
[MongoDB](./compass-connections.json)

# Front End build 방법

1. fe 디렉토리로 이동
2. npm i
3. .env.local 을 fe 폴더 바로 하위에 생성

```
NEXT_PUBLIC_BACKEND_URL=백엔드서버코드
NEXT_PUBLIC_FRONTEND_URL=프론트url
```

4. npm run build 후 npm run start

(개발 환경 : npm run dev)
