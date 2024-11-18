# 🌟 삼성 청년 SW 아카데미 11기 S108 🌟

# 🌳 프로젝트 개요

### ✨ 팀원

|  팀장  |  팀원  |  팀원  |  팀원  |  팀원  |  팀원  |
| :----: | :----: | :----: | :----: | :----: | :----: |
| 황병현 | 최현성 | 김호경 | 김경대 | 강승우 | 최지훈 |

### 📅 기간

- 기획 및 설계 : 2024.10.14 - 2024.10.18
- 개발 : 2024.10.21 - 2024.11.19

# 💎 소개

### 🌃 기획 의도

Vision AI는 컴퓨터가 이미지를 인식하고 해석할 수 있게 하는 기술입니다.  
사람은 눈과 뇌를 통해서 이미지를 보고 무엇이 있는지를 인식하듯이  
컴퓨터는 이 기술을 이용해서 이미지를 분석합니다.

MLOps는 머신 러닝 자동 학습을 위한 파이프라인 구축 플랫폼 같은 것이며
머신러닝 모델을 실제 서비스에 안정적으로 적용하고 관리하는 방법론입니다.

저희는 이러한 것을 조합하여, 사용자에게 데이터를 받아서 자동으로 분석을 하여, 각각 이미지에 대한 메타 데이터를 손쉽게 확인할 수 있도록 목표를 두고 있습니다.

즉 저희 프로젝트의 목표는 Vision AI MLOps 구축을 위한 데이터 분석 플랫폼 개발이 목표입니다.
다만 완전한 자동화가 아닌, 사용자가 이미지들을 올리면 자동으로 분석을 하고, 해당 분석을 통한  
MLOps 구축하는 것입니다.

### 🔍 주요 기능

- 사용자에게 학습시킬 이미지 및 추가적인 데이터(MetaData, Feature 등)을 업로드 할 수 있으며, 반대로 이에 대한 분석 결과를 다운로드 할 수 있습니다.

- 이미지들에 대한 AI의 분석을 거치면 다차원 벡터(행렬)에 대한 값(Feature들)을 얻을 수 있으며, 그것들을 축소시켜서 2, 3차원으로 시각화가 가능합니다.

- 각 이미지마다 출처, 생성 시각, 모델 정보, 추론 결과 등에 대한 태그를 부여를 직접 할 수 있습니다.

- Vision 검사결과에 대해 다양한 옵션(AND, OR, NOT)으로 검색이 가능할 수 있습니다.

### 🌃 타겟층

AI를 통해서 불량을 검증하는 모든 제조업 및 공장을 타겟으로 잡고 있습니다.

# 🔨 Tech Stack 🔨

### Front End

![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge)
![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge)
![Redux Badge](https://img.shields.io/badge/Redux%20ToolKit-764ABC?logo=redux&logoColor=fff&style=for-the-badge)
![Next.js Badge](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=fff&style=for-the-badge)
![Chart.js Badge](https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=fff&style=for-the-badge)

![HTML5 Badge](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff&style=for-the-badge)
![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff&style=for-the-badge)
![NextUI Badge](https://img.shields.io/badge/NextUI-000?logo=nextui&logoColor=fff&style=for-the-badge)

### Back End

![Python Badge](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff&style=for-the-badge)
![FastAPI Badge](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=fff&style=for-the-badge)
![PyTorch Badge](https://img.shields.io/badge/PyTorch-EE4C2C?logo=pytorch&logoColor=fff&style=for-the-badge)
![NumPy Badge](https://img.shields.io/badge/NumPy-013243?logo=numpy&logoColor=fff&style=for-the-badge)
![Pytest Badge](https://img.shields.io/badge/Pytest-0A9EDC?logo=pytest&logoColor=fff&style=for-the-badge)
![scikit-learn Badge](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikitlearn&logoColor=fff&style=for-the-badge)

### DB

![Redis Badge](https://img.shields.io/badge/Redis-FF4438?logo=redis&logoColor=fff&style=for-the-badge)
![MongoDB Badge](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff&style=for-the-badge)
![MariaDB Badge](https://img.shields.io/badge/MariaDB-003545?logo=mariadb&logoColor=fff&style=for-the-badge)
![SQLAlchemy Badge](https://img.shields.io/badge/SQLAlchemy-D71F00?logo=sqlalchemy&logoColor=fff&style=for-the-badge)

### Infra

![Amazon EC2 Badge](https://img.shields.io/badge/Amazon%20EC2-F90?logo=amazonec2&logoColor=fff&style=for-the-badge)
![Amazon S3 Badge](https://img.shields.io/badge/Amazon%20S3-569A31?logo=amazons3&logoColor=fff&style=for-the-badge)
![Jenkins Badge](https://img.shields.io/badge/Jenkins-D24939?logo=jenkins&logoColor=fff&style=for-the-badge)
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=for-the-badge)

### Team Collaboration Tools

![Jira Badge](https://img.shields.io/badge/Jira-0052CC?logo=jira&logoColor=fff&style=for-the-badge)
![GitLab Badge](https://img.shields.io/badge/GitLab-FC6D26?logo=gitlab&logoColor=fff&style=for-the-badge)
![Mattermost Badge](https://img.shields.io/badge/Mattermost-0058CC?logo=mattermost&logoColor=fff&style=for-the-badge)
![Git Badge](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff&style=for-the-badge)

### Architecture

![architecture](architecture.png)

# 🌍 서비스 기능

## 🎯 회원

### 자동 로그인

## 🎯 핵심 기능

### 이미지 업로드

### 분석

# 🔆 기술

## 🖥️ Front End

### MiddleWare 및 쿠키를 이용한 접속&Fetch 제어

해당 프로젝트에서 핵심적인 기능에 대한 부분은 접근 권한이 매우 중요합니다.
Next.js 에서는 접속 할 때 Cookie에 담긴 정보를 이용해서 빠르게 접근을 제한 할 수 있습니다.

Cookie에는 유효시간이 매우 짧은 AccessToken, 그나마 긴 RefreshToken을 활용하여,
해당 AccessToken이 유효한지, 혹은 유효하지 않더라도 RefreshToken을 통해서 자동으로 토큰 재발급을 시도합니다.

해당 작업은 Next.js 에서 페이지 접속, Server Action, Route handler 등에 자동적으로 Middleware라는 곳을 거치며, 이를 이용해서 자동적으로 Authorization이 처리됩니다.

### 자동 로그인

처음 접속 할 때 refreshToken을 이용한 자동 로그인을 지원합니다.
이 또한 RefreshToken을 활용하여, 재 발급을 시도하며, 재 발급이 성공하면 그 즉시 로그인이 되도록 해 줍니다.

### Drag & Drop

### Chart.js

## 🖥️ Back End
