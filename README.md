# VibeCoding TODO 웹앱 (Monorepo)

## 프로젝트 개요

VibeCoding TODO 웹앱은 프론트엔드와 백엔드를 단일 저장소(모노레포)로 통합 관리하는 할 일 관리 웹 애플리케이션입니다. 사용자는 할 일(Task)을 추가, 수정, 삭제, 완료 처리할 수 있으며, 직관적이고 반응형인 UI와 AWS 기반의 확장 가능한 백엔드 인프라를 제공합니다.

## 주요 특징
- **모노레포 구조**: `/frontend`, `/backend`, `/infra`, `/docs` 등으로 서비스별 분리
- **프론트엔드**: React + Vite + Mantine UI Kit 기반, 반응형/다크모드/접근성 지원
- **백엔드**: Node.js + TypeScript + AWS Lambda + DynamoDB, TDD 기반 개발
- **인증**: AWS Cognito + Google OAuth 연동
- **인프라**: AWS CDK를 활용한 IaC(Infrastructure as Code)
- **테스트/문서화**: Jest, React Testing Library, 상세 설계 및 요구사항 문서화

## 폴더 구조
```
root/
├── frontend/   # 프론트엔드 소스코드 (React, Mantine)
├── backend/    # 백엔드 소스코드 (Node.js, Lambda)
├── infra/      # 인프라(IaC) 코드 (AWS CDK)
├── docs/       # 요구사항, 설계, 체크리스트 등 문서
└── README.md   # 프로젝트 설명 파일
```

## 시작하기 (Getting Started)

1. 저장소 클론
```bash
git clone <your-repo-url>
cd vibecoding_demo_2
```

2. 프론트엔드 개발 환경 세팅
```bash
cd frontend
npm install
npm run dev
```

3. 백엔드 개발 환경 세팅
```bash
cd backend
npm install
# 테스트 및 실행 방법은 추후 추가 예정
```

4. 인프라 IaC (CDK) 배포
```bash
cd infra
npm install
cdk deploy
```

## 문서
- 요구사항: `docs/requirements.md`
- 설계: `docs/design.md`
- 체크리스트: `docs/checklist.md`

## 라이선스
MIT License
