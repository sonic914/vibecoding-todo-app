# TODO 웹앱 개발 체크리스트

본 체크리스트는 설계 지침

- UI 설계 시 Mantine의 컴포넌트 구조와 스타일 가이드를 준수한다.
- 반응형(Responsive) UI 구현 시 Mantine의 Grid, MediaQuery 등 유틸리티를 활용한다.
- 접근성(Accessibility) 및 다크모드 지원은 Mantine의 기본 기능을 적극 활용한다.

문서(design.md)와 요구사항에 기반하여, 실제 구현 및 커밋 단위를 명확히 관리하기 위한 가이드입니다.

---

## UI 구현 요건

- 프론트엔드 UI는 [Mantine UI Kit](https://mantine.dev/)을 사용하여 구현한다.
- 가능한 모든 UI 컴포넌트(버튼, 입력폼, 모달 등)는 Mantine에서 제공하는 컴포넌트를 우선적으로 활용한다.
- Mantine의 Theme, Color Scheme, Layout 시스템을 적극 활용하여 일관된 UX를 제공한다.
- 커스텀 디자인이 필요한 경우에도 Mantine의 스타일 시스템(Style props, Emotion 등)을 우선 활용한다.

---

## 1. 프로젝트 구조 및 환경 세팅 (Monorepo)
- [x] 모노레포(단일 저장소) 기반 프론트엔드/백엔드 폴더 구조 생성 및 초기화  
  - 예시: `/frontend`, `/backend`, `/docs`, `/infra` 등
  - 커밋: `chore: 모노레포 폴더 및 기본 구조 생성`
  - 커밋: `chore: 기본 폴더 구조 및 .gitkeep 파일 추가`
- [x] 프론트엔드 개발 환경(Vite, React, Mantine) 세팅  
  - 커밋: `chore(frontend): Vite/React/Mantine 환경 구축`
- [x] 백엔드 개발 환경(Node.js, TypeScript, Jest) 세팅  
  - 커밋: `chore(backend): Node.js/TypeScript/Jest 환경 구축`
- [x] 공통 코드 컨벤션 및 린트 설정  
  - 커밋: `chore: 린트/포맷터/공통 설정 추가`
- [x] 프로젝트 규칙 파일(windsurfrules.md) 생성  
  - 커밋: `docs: 프로젝트 규칙 파일(windsurfrules.md) 생성`

---

## 2. 프론트엔드: TODO 상태관리 및 로컬스토리지 CRUD (TDD)
- [x] **할 일(Task) 엔티티/타입 정의**  
  - 커밋: `feat(frontend): 할 일(Task) 타입/엔티티 정의`
- [x] **상태관리 로직(useReducer) 테스트 코드 작성**  
  - 커밋: `test(frontend): useReducer 상태관리 테스트 추가`
- [x] **상태관리 리듀서/액션 구현**  
  - 커밋: `feat(frontend): useReducer 기반 상태관리 구현`
- [x] **LocalStorage 연동 유틸 테스트 코드 작성**  
  - 커밋: `test(frontend): LocalStorage 유틸 테스트 추가`
- [x] **LocalStorage 연동 유틸 구현**  
  - 커밋: `feat(frontend): LocalStorage 연동 구현`
- [x] **TaskContext에 LocalStorage 연동 테스트 추가**  
  - 커밋: `test(frontend): TaskContext에 LocalStorage 연동 테스트 추가`
- [x] **TaskContext에 LocalStorage 연동 기능 구현**  
  - 커밋: `feat(frontend): TaskContext에 LocalStorage 연동 기능 구현`
- [x] **할 일 CRUD(추가/수정/삭제/완료/미완료) 기능 테스트 코드 작성**  
  - 커밋: `test(frontend): 할 일 CRUD 테스트 추가`
- [x] **할 일 CRUD 기능 구현**  
  - 커밋: `feat(frontend): 할 일 CRUD 기능 구현`

---

## 3. 프론트엔드: UI/UX 컴포넌트 및 기능 구현
- [x] **Undo 기능 구현**  
  - 커밋: `feat(frontend): Undo 기능 구현`
- [x] **입력폼, 리스트뷰, 필터, 다크/라이트모드, 접근성 등 UI/UX 컴포넌트 구현**  
  - 커밋: `feat(frontend): UI/UX 컴포넌트 및 기능 구현`

---

## 4. 프론트엔드: GitHub Actions + Pages 배포 자동화
- [x] GitHub Actions 워크플로우 작성  
  - 커밋: `ci(frontend): GitHub Actions 배포 자동화`
- [x] GitHub Pages 배포 테스트  
  - 커밋: `docs: 프론트엔드 배포 테스트/결과 기록`

---

## 5. 백엔드: Clean Architecture 기반 Lambda API (TDD)
- [x] **Domain: 할 일 엔티티/모델 정의 및 테스트**  
  - 커밋: `test(backend): Domain 엔티티/모델 테스트 추가`
  - 커밋: `feat(backend): Domain 엔티티/모델 구현`
- [x] **Application: UseCase(비즈니스 로직) 테스트 코드 작성**  
  - 커밋: `test(backend): UseCase 테스트 추가`
- [x] **Application: UseCase(비즈니스 로직) 구현**  
  - 커밋: `feat(backend): UseCase 구현`
- [x] **Infrastructure: DynamoDB 연동 레포지토리 테스트 코드 작성**  
  - 커밋: `test(backend): DynamoDB 레포지토리 테스트 추가`
- [x] **Infrastructure: DynamoDB 연동 레포지토리 구현**  
  - 커밋: `feat(backend): DynamoDB 레포지토리 구현`
- [x] **Presentation: Lambda 핸들러(REST API) 테스트 코드 작성**  
  - 커밋: `test(backend): Lambda 핸들러 테스트 추가`
- [x] **Presentation: Lambda 핸들러(REST API) 구현**  
  - 커밋: `feat(backend): Lambda 핸들러 구현`

---

## 6. 프론트엔드 & 백엔드: 인증 (AWS Amplify, Cognito + Google OAuth)
- [x] **AWS Cognito User Pool 및 Google OAuth 연동 설정 (백엔드/인프라)**
  - 커밋: `feat(backend): Cognito + Google OAuth 인증 연동`
  - AWS CLI 설치 및 계정 구성 (완료)
  - Cognito User Pool 생성 (ID: `ap-northeast-2_zNUOZQuzD`)
  - 앱 클라이언트 생성 (ID: `454aegm2igrm52s2lrlqscgefa`)
  - Google OAuth 클라이언트 ID 및 보안 비밀번호 설정 (Google Cloud Console)
  - Cognito User Pool에 Google을 ID 공급자로 추가
  - 앱 클라이언트에 Google IDP 연동 완료
  - Cognito 호스팅 UI 도메인 설정 (`ap-northeast-2znuozquzd.auth.ap-northeast-2.amazoncognito.com`)
- [x] **백엔드: 인증 미들웨어/토큰 검증 로직 테스트 및 구현**
  - 커밋: `test(backend): 인증 미들웨어 테스트 추가`
  - 커밋: `feat(backend): 인증 미들웨어 구현`
  - 커밋: `feat(backend): 인증 미들웨어를 모든 Lambda 핸들러에 적용 및 경로 오류 수정`
- [x] **프론트엔드: AWS Amplify 연동 및 인증 UI 구현**
  - `aws-amplify` v6 호환성 문제 해결 (`AuthContext.tsx`, `main.tsx`)
  - Amplify 설정 파일 (`amplify.ts`)에 Cognito 환경 변수 및 OAuth 리디렉션 URI (`http://localhost:3000`) 설정
  - 로그인/로그아웃 기능 구현 (`AuthContext.tsx`, `App.tsx`)
  - Google OAuth `redirect_uri_mismatch` 오류 해결 (Google Cloud Console "승인된 리디렉션 URI"에 Cognito 콜백 URI `https://[your-cognito-domain]/oauth2/idpresponse` 정확히 등록 및 브라우저 캐시 문제 해결)
  - 커밋: `fix(frontend): Amplify v6 호환성 및 Hub/Auth 모듈 사용 수정`
  - 커밋: `feat(frontend): 로그아웃 버튼 추가 및 인증 컨텍스트 연동`
  - 커밋: `fix(frontend): Google OAuth redirect_uri_mismatch 해결 및 설정 검증`

---

## 7. 인프라: AWS CDK로 IaC 구현
- [x] CDK로 API Gateway, Lambda, DynamoDB, Cognito 리소스 정의  
  - 커밋: `feat(infra): AWS CDK IaC 구현`
  - `infra/cdk` 폴더 생성 및 CDK 프로젝트 수동 설정
  - DynamoDB 테이블 리소스 정의 (TasksTable)
  - Lambda 함수 리소스 정의 (GetAllTasks, GetTaskById, CreateTask, UpdateTask, DeleteTask)
  - API Gateway (RestApi) 리소스 정의 및 Lambda 통합
  - Cognito User Pool Authorizer 정의 (기존 User Pool ID 사용)
- [x] 리소스 Description 영문 작성 및 문서화  
  - 커밋: `docs: 인프라 리소스 설명/문서화`
  - `infra/cdk/README.md` 파일 작성
  - DynamoDB, Lambda, API Gateway, Cognito 리소스 상세 설명
  - 인프라 배포 및 구성 가이드 작성

---

## 8. 통합 및 배포, 문서화
- [ ] 프론트엔드-백엔드 연동 통합 테스트  
  - 커밋: `test: 통합 테스트 및 연동 검증`
- [ ] 접근성, 반응형, 브라우저 호환성 최종 점검  
  - 커밋: `test: 접근성/반응형/호환성 점검`
- [ ] 문서 정리 및 최종 README/설계/아키텍처 갱신  
  - 커밋: `docs: 최종 문서 정리`

---

> **TDD 원칙:** 코어 비즈니스 로직(상태관리, 데이터, 백엔드)은 반드시 테스트 코드 작성 → 구현 → 커밋 순으로 진행할 것.
> 
> 각 단계별로 체크박스와 커밋 메시지를 참고하여 개발하세요.
