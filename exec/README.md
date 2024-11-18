# Gitlab 소스 클론 이후 빅드 및 배포할 수 있도록 정리한 문서

1. 사용한 JVM, 웹서버, WAS 제품 등의 종류와 설정 값, 버전(IDE버전 포함)기재
2. 빌드 시 사용되는 환경 변수 등의 내용 상세 기재
3. 배포 시 특이사항 기재
4. DB접속 정보 등 프로젝트(ERD)에 활용되는 주요 계정 및 프로퍼티가 정의된 파일 목록

사용도구
---------------
 - 이슈 관리 : Jira
 - 형상 관리 : GitLab
 - 커뮤니케이션 : Notion, MatterMost
 - 디자인 : Figma
 - CI/CD : Jenkins

개발도구
----------------
- Backend
    - Intellij Ultimate 2024.1.4
    - Visual Studio Code : 1.93
- Android
    - Android Studio : Koala 1.1

개발환경
----------------
**BackEnd**
| 언어 | 버전 |
| --- | --- |
| Python | 3.10.6 |
| FastAPI | 0.114.1 |
| Java | 17 |
| Springboot | 3.3.3 |
| Spring Security | newest |
| Spring Data JPA | newest |
| Spring Data Redis | newest |

**Android**
|언어|버전|
|------|---|
|Kotlin|1.9|

### Database

| 언어 | 버전 |
| --- | --- |
| Mysql | 8.10 |
| Redis | 7.2.1 |

### Infra

| 언어 | 버전 |
| --- | --- |
| Jenkins | 2.477 |
| Nginx | 1.25.2 |
| Ec2 | 2.3.978.0 |

EC2 포트번호
----------------
- Backend : 8080
- MySQL : 3306
- Redis : 6379
- Kibana : 5601
- elastic search : 9200

# 프로젝트에서 사용하는 외부 서비스 정보를 정리한 문서
| 소셜 인증, 포톤 클라우드, 코드 컴파일 등에 활용 된 '외부 서비스'가입 및 활용에 필요한 정보
 - Ngrok : backend(AI)/src/ngrok.json에 해당 내용 있음(FastAPI 도메인을 열기위해 필요)
 - application-dev.properties : S3 Secret Key 및 연동 계정 정보, java mail 인증용 ID, Instagram 개발용 계정 정보, elastic search 사용에 필요한 연동 정보, Redis 연동 정보 (gitignore로 커밋 방지)

# DB 덤프 파일 최신본

[DB](./Dump20241010.sql)

# 시연 시나리오

### 1. 콜드 스타트
첫 화면에서의 콜드 스타트 상황을 보여주는 장면입니다. 앱이 처음 실행될 때의 기본 상태를 나타냅니다.

<img src="https://github.com/user-attachments/assets/ed09acc1-5014-4ae5-920f-ed6b3b36cbdb" alt="콜드 스타트" width="300"/>

---

### 2. 미술관 생성
사용자가 미술관을 생성하는 과정의 화면입니다. 미술관을 만드는 인터페이스와 절차를 볼 수 있습니다.

<img src="https://github.com/user-attachments/assets/a9fc4bb5-f31b-4d9f-9f8c-b61e34111c20" alt="미술관 생성" width="300"/>

---

### 3. 인스타그램 스타일 화면
#### 3-1. 인스타그램 스타일 갤러리 1
앱에서 인스타그램 스타일의 갤러리를 제공하며, 작품들을 카드 형식으로 표시합니다.

<img src="https://github.com/user-attachments/assets/c9a54f87-e219-41b4-9873-1b67ee1183be" alt="인스타그램 스타일 1" width="300"/>

#### 3-2. 인스타그램 스타일 갤러리 2
또 다른 인스타그램 스타일의 갤러리 화면입니다. 여러 작품이 미리 보기 형태로 제공됩니다.

<img src="https://github.com/user-attachments/assets/4aa73cf4-b68f-42ec-bf31-7ce75b15bb4b" alt="인스타그램 스타일 2" width="300"/>

---

### 4. 메인 화면
앱의 메인 화면으로, 전체적인 UI와 주요 기능들이 배치되어 있습니다.

<img src="https://github.com/user-attachments/assets/5598b933-4e2f-4c06-8e0e-0cfd92ff1b29" alt="메인 화면" width="300"/>

---

### 5. 미술관 진입
사용자가 선택한 미술관으로 진입하는 과정을 보여줍니다. 미술관 내부로 들어가는 장면입니다.

<img src="https://github.com/user-attachments/assets/68db00f5-2d36-40aa-8805-a5fa918ac680" alt="미술관 진입" width="300"/>

---

### 6. 작품 디테일 화면
작품의 세부 정보를 보여주는 화면입니다. 각 작품의 설명과 세부 사항들이 표시됩니다.

<img src="https://github.com/user-attachments/assets/8aa11f39-c371-48b8-a4ba-9fb6b406ca71" alt="작품 디테일" width="300"/>

---

### 7. AR(증강현실) 모드
작품을 증강현실(AR)로 확인하는 장면입니다. 사용자는 작품을 AR 환경에서 체험할 수 있습니다.

<img src="https://github.com/user-attachments/assets/70ece0ae-87f4-49c5-93cc-a21462908609" alt="AR 모드" width="300"/>

---

### 8. 팝아트 검색
#### 8-1. 검색 팝아트 결과
사용자가 팝아트 작품을 검색한 결과를 보여줍니다.

<img src="https://github.com/user-attachments/assets/89098c83-b98c-46da-9528-a578cbff8f3a" alt="팝아트 검색" width="300"/>

---

### 9. 작품 등록
#### 9-1. 작품 등록 화면 1
작품을 앱에 등록하는 첫 번째 화면입니다.

<img src="https://github.com/user-attachments/assets/40f0046e-61c9-41f7-b6cf-b917fa46ddc1" alt="작품 등록 1" width="300"/>

#### 9-2. 작품 등록 화면 2
작품 등록 과정의 두 번째 화면입니다.

<img src="https://github.com/user-attachments/assets/97e7a202-0f96-4eb6-8326-a0faef00ffa3" alt="작품 등록 2" width="300"/>

#### 9-3. 작품 등록 화면 3
작품 등록 과정의 세 번째 화면입니다.

<img src="https://github.com/user-attachments/assets/1f851709-4e75-48e1-9fff-fc787e0e8d40" alt="작품 등록 3" width="300"/>

#### 9-4. 작품 등록 완료
작품이 성공적으로 등록된 후의 완료 화면입니다.

<img src="https://github.com/user-attachments/assets/f79911a1-48fa-47bc-8492-79576de25c08" alt="작품 등록 완료" width="300"/>

---

### 10. 미술관
#### 10-1. 구독한 미술관
사용자가 구독한 미술관 목록을 보여주는 화면입니다.

<img src="https://github.com/user-attachments/assets/f0af05ad-dfb2-4a65-892e-dae05961d216" alt="구독한 미술관" width="300"/>

#### 10-2. 내 미술관
사용자가 직접 소유한 미술관을 표시하는 화면입니다.

<img src="https://github.com/user-attachments/assets/cbbc1612-5d36-4c97-b72a-1c58a980d79a" alt="내 미술관" width="300"/>

---

### 11. 포트폴리오
#### 11-1. 포트폴리오 화면
사용자가 만든 포트폴리오를 보여주는 화면입니다.

<img src="https://github.com/user-attachments/assets/b17be900-a5b7-408f-9221-7030b518e2c6" alt="포트폴리오" width="300"/>



