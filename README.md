# 💸 Vue.js-SADARI (가계부 프로젝트)

- Vue.js를 기반으로 한 가계부 관리 애플리케이션입니다.  
- 월별 수입/지출을 기록하고, 목표 설정과 통계를 통해 지출 습관을 파악할 수 있습니다.

## 🖥️ 프로젝트 소개

- **프로젝트명**: SADARI
- **주요 목표**: 직관적인 UI와 차트 기반 통계를 제공하는 사용자 친화적 가계부 앱 개발  
- **특징**: 캘린더 기반 거래 관리 + 목표 대비 소비 분석 + 회원 관리 기능 탑재

---

## ⏱ 개발 기간

2025.04.07 ~ 2025.04.10

---

## 👥 팀 구성

| 이름 | 역할 |
|------|------|
| 김건호 | AnalyticsPage chart.js 기반 그래프 표현, Transaction 통합  
| 김규석 | CalendarPage 거래 내역 CRUD 구현 및 반응형 디자인
| 김성학 | DashboardPage 및 HomePage, ProfilePage 등 디자인 총괄
| 박상일 | HomePage, ProfilePage USER CRUD, AnalyticsPage 목표 시각화    
---

## ⚙️ 개발 환경

| 항목 | 기술 |
|------|------|
| **Frontend** | Vue.js 3, Vue Router |
| **상태 관리** | Pinia |
| **UI 프레임워크** | Bootstrap 5 |
| **API 통신** | Axios |
| **차트 시각화** | Chart.js |
| **Mock Backend** | JSON Server |

![{05B4F0DE-2528-4763-8674-1DE9E80274FD}](https://github.com/user-attachments/assets/af69c21b-9e6b-40bf-9cac-8f9019b624d4)

---

## 📌 주요 기능

### ✅ 로그인 / 회원가입

- 이메일 중복 체크 및 유효성 검사
- 세션 기반 로그인 유지
- 회원 정보 저장 (user.json)

### 📋 대시보드

- 전체 거래 목록 확인
- 거래 추가, 수정, 삭제
- 카테고리/기간별 필터링

### 📆 캘린더

- 달력에서 수입/지출 확인
- 날짜별 거래 관리 (CRUD)
- 고정 거래 등록 가능

### 📊 분석

- 목표 설정 대비 지출 보기
- 날짜별 지출 통계
- 날짜별 수입/지출 라인 그래프
- 도넛, 막대, 라인 차트로 비중 시각화

### 👤 프로필

- 유저 정보 확인 및 수정
- 프로필 이미지 업로드
- 목표 금액 변경 → 분석에 즉시 반영
- 로그아웃 및 회원탈퇴

---

## 🔍 user.json 예시

```json
{
  "users": [
    {
      "id": "d3e6",
      "name": "테스트",
      "email": "test@test.com",
      "password": "123",
      "profileImage": null,
      "goals": {
        "month": {
          "total": 400000,
          "categories": {
            "식비": 150000,
            "의료": 10000,
            "교통": 30000,
            "여가": 50000,
            "통신": 13900,
            "기타": 20000
          }
        },
        "year": {
          "total": 2000000,
          "categories": {
            "식비": 500000,
            "의료": 300000,
            "교통": 400000,
            "여가": 300000,
            "통신": 200000,
            "기타": 300000
          }
        }
      }
    }
  ]
}
```

## 팀프로젝트 틀 세팅 목록입니다.
    npm install
- pinia
- axios
- bootstrap@5
- chart.js
- fullcalendar
- animate
- date-fns

## 개발 시작하면 이렇게 해주세요!

- 일단 branch !!!
- pinia는 필요하다면 새로운 스토어파일 작성해서 진행 -> 추후 통합하죠!
- 페이지, 컴포넌트 또한 필요하다면 추가해주세요!
- 주석도 자세히 달아주시면 좋을 듯 합니다!!!

## Commit 접두어

| Type         | Description                                                        |
| ------------ | ------------------------------------------------------------------ |
| **Feat**     | 새로운 기능 추가                                                   |
| **Design**   | CSS 등 UI 디자인 변경                                              |
| **Refactor** | 코드 리팩토링                                                      |
| Fix          | 버그 수정                                                          |
| **Docs**     | 문서 작업 (README 수정 포함)                                       |
| Style        | 코드 스타일 및 포맷 변경 (함수/변수명 변경 포함)                   |
| Test         | 테스트 코드 작성, 테스트 리팩토링                                  |
| Chore        | 소스 코드를 건드리지 않는 작업 - 패키지 매니저 설정(ex: gitignore) |
| Init         | 초기화                                                             |
| Build        | 빌드 관련 파일 수정                                                |
| CI           | CI 관련 설정 수정                                                  |
| **Rename**   | 파일 혹은 폴더명을 수정하거나 옮기는 작업만 수행                   |
| **Remove**   | 파일을 삭제하는 작업만 수행                                        |
