# 🌟 삼성 청년 SW 아카데미 11기 S108 🌟

# 🌳 프로젝트 개요
지속 가능한 Vision AI 모델 운영을 위해서는 끊임없이 새로운 데이터가 수집되고 정제되어 모델 재학습으로 이어져야 한다.
    과거에는 데이터가 부족한 점이 문제였다면 이제는 많은 데이터 중에서 분석을 통해 보다 의미있는 데이터를 선별하여 효과적인 학습을 진행하는 것이 중요해졌다.
	이를 위해 수집된 원시 데이터(Raw Data)로부터 유의미한 Feature를 추출하고 분석을 위해 시각화 하는 것이 필요하다.


# 목표
  - 데이터 업로드 → **Metadata 생성(AI 모델 추론 결과 필요) → **이미지의 Feature Vector 추출 (Feature Extractor AI 모델 필요)
    → Feature 차원 축소(t-SNE, UMAP) → 시각화 (2D or 3D)
  - Metadata, Multiple Tag 활용을 통한 데이터 검색 기능 개발
    . Metadata는 일반적인 데이터 검색 (Date, AI Model Prediction 등의 검색 조건)
	. Tag는 개별 이미지 데이터에 자유롭게 부여, 삭제 하고 Only Tag를 이용하여 검색 (단 tags 조합 시 AND, OR 조건 조합)
  - Feature 분석을 통한 모델 재학습 기준 수립
    . Feature는 AI Model 에서 추출한 float array(Vector) 데이터
	. 고차원이므로 시각화를 위해 2~3차원으로 축소 필요
	. 시각화된 Feature에서 outlier를 확인하고 필요한 데이터를 선택적으로 조회하는 기능 필요

## ✨ 팀원

|  팀장  |  팀원  |  팀원  |  팀원  |  팀원  |  팀원  |
| :----: | :----: | :----: | :----: | :----: | :----: |
| 황병현 | 최현성 | 김호경 | 김경대 | 강승우 | 최지훈 |
| BE | BE | BE | FE | FE | FE |

## 카테고리

| Application | Language | Framework |
| --- | --- | --- |
| ✅ Desktop Web  | ✅ JavaScript | 🔲 Vue.js |
| 🔲 Mobile Web  | ✅ TypeScript | ✅ React |
| 🔲 Responsive Web  | 🔲 C/C++ | ✅ Next.js |
| 🔲 Android App  | 🔲 C# | 🔲 Node.js |
| 🔲 iOS App  | ✅ Python | 🔲 FastAPI |
| 🔲 Desktop App  | 🔲 Java | 🔲 Spring/Springboot |
|  | 🔲 Kotlin |✅ Tailwind.CSS |
|  | ✅ SQL |🔲 Redux / Redux tool kit  |

# ERD

[ERD](https://dbdiagram.io/d/670f115497a66db9a31d5cda)

# 기능명세서
[기능명세서](https://www.notion.so/12145f92e33a80b89eebfdde2300cd03?pvs=4)

# MockUp
[Figma](https://www.figma.com/design/O7IX5n1EiGBVMiYwCZ8OqN/S108-%ED%99%94%EB%A9%B4%EC%84%A4%EA%B3%84?node-id=0-1&node-type=canvas&t=0G7UV7igRVQm2wPU-0)
