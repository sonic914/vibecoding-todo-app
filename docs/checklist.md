# TODO 웹앱 개발 체크리스트

본 체크리스트는 설계 문서(design.md)와 요구사항에 기반하여, 실제 구현 및 커밋 단위를 명확히 관리하기 위한 가이드입니다.

---

## 1. 프로젝트 구조 및 환경 세팅
- [ ] 프론트엔드/백엔드 폴더 구조 생성 및 초기화  
  - 커밋: `chore: 프로젝트 폴더 및 기본 구조 생성`
- [ ] 프론트엔드 개발 환경(Vite, React, TailwindCSS) 세팅  
  - 커밋: `chore(frontend): Vite/React/TailwindCSS 환경 구축`
- [ ] 백엔드 개발 환경(Node.js, TypeScript, Jest) 세팅  
  - 커밋: `chore(backend): Node.js/TypeScript/Jest 환경 구축`
- [ ] 공통 코드 컨벤션 및 린트 설정  
  - 커밋: `chore: 린트/포맷터/공통 설정 추가`

---

## 2. 프론트엔드: TODO 상태관리 및 로컬스토리지 CRUD (TDD)
- [ ] **할 일(Task) 엔티티/타입 정의**  
  - 커밋: `feat(frontend): 할 일(Task) 타입/엔티티 정의`
- [ ] **상태관리 로직(useReducer) 테스트 코드 작성**  
  - 커밋: `test(frontend): useReducer 상태관리 테스트 추가`
- [ ] **상태관리 리듀서/액션 구현**  
  - 커밋: `feat(frontend): useReducer 기반 상태관리 구현`
- [ ] **LocalStorage 연동 유틸 테스트 코드 작성**  
  - 커밋: `test(frontend): LocalStorage 유틸 테스트 추가`
- [ ] **LocalStorage 연동 유틸 구현**  
  - 커밋: `feat(frontend): LocalStorage 연동 구현`
- [ ] **할 일 CRUD(추가/수정/삭제/완료/미완료) 기능 테스트 코드 작성**  
  - 커밋: `test(frontend): 할 일 CRUD 테스트 추가`
- [ ] **할 일 CRUD 기능 구현**  
  - 커밋: `feat(frontend): 할 일 CRUD 기능 구현`

---

## 3. 프론트엔드: UI/UX 컴포넌트 및 기능 구현
- [ ] 입력폼, 리스트뷰, 필터, Undo, 다크/라이트모드, 접근성 등 UI/UX 컴포넌트 구현  
  - 커밋: `feat(frontend): UI/UX 컴포넌트 및 기능 구현`

---

## 4. 프론트엔드: GitHub Actions + Pages 배포 자동화
- [ ] GitHub Actions 워크플로우 작성  
  - 커밋: `ci(frontend): GitHub Actions 배포 자동화`
- [ ] GitHub Pages 배포 테스트  
  - 커밋: `docs: 프론트엔드 배포 테스트/결과 기록`

---

## 5. 백엔드: Clean Architecture 기반 Lambda API (TDD)
- [ ] **Domain: 할 일 엔티티/모델 정의 및 테스트**  
  - 커밋: `test(backend): Domain 엔티티/모델 테스트 추가`
  - 커밋: `feat(backend): Domain 엔티티/모델 구현`
- [ ] **Application: UseCase(비즈니스 로직) 테스트 코드 작성**  
  - 커밋: `test(backend): UseCase 테스트 추가`
- [ ] **Application: UseCase(비즈니스 로직) 구현**  
  - 커밋: `feat(backend): UseCase 구현`
- [ ] **Infrastructure: DynamoDB 연동 레포지토리 테스트 코드 작성**  
  - 커밋: `test(backend): DynamoDB 레포지토리 테스트 추가`
- [ ] **Infrastructure: DynamoDB 연동 레포지토리 구현**  
  - 커밋: `feat(backend): DynamoDB 레포지토리 구현`
- [ ] **Presentation: Lambda 핸들러(REST API) 테스트 코드 작성**  
  - 커밋: `test(backend): Lambda 핸들러 테스트 추가`
- [ ] **Presentation: Lambda 핸들러(REST API) 구현**  
  - 커밋: `feat(backend): Lambda 핸들러 구현`

---

## 6. 백엔드: 인증(AWS Cognito + Google OAuth)
- [ ] Cognito User Pool 및 Google OAuth 연동 설정  
  - 커밋: `feat(backend): Cognito + Google OAuth 인증 연동`
- [ ] 인증 미들웨어/토큰 검증 로직 테스트 및 구현  
  - 커밋: `test(backend): 인증 미들웨어 테스트 추가`
  - 커밋: `feat(backend): 인증 미들웨어 구현`

---

## 7. 인프라: AWS CDK로 IaC 구현
- [ ] CDK로 API Gateway, Lambda, DynamoDB, Cognito 리소스 정의  
  - 커밋: `feat(infra): AWS CDK IaC 구현`
- [ ] 리소스 Description 영문 작성 및 문서화  
  - 커밋: `docs: 인프라 리소스 설명/문서화`

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
