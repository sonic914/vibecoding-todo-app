# Frontend

이 폴더는 VibeCoding TODO 웹앱의 프론트엔드(React + Vite + Mantine) 소스코드를 관리합니다.

## 기술 스택

- React 18
- TypeScript
- Vite
- Mantine UI Kit
- Jest + React Testing Library

## 디렉토리 구조

```
frontend/
├── public/            # 정적 파일
├── src/
│   ├── api/           # API 통신 관련 코드
│   ├── components/    # 재사용 가능한 UI 컴포넌트
│   ├── contexts/      # React Context API 기반 상태 관리
│   ├── pages/         # 페이지 컴포넌트
│   ├── reducers/      # 상태 관리 리듀서
│   ├── tests/         # 테스트 유틸리티
│   ├── App.tsx        # 루트 컴포넌트
│   └── main.tsx       # 앱 진입점
└── package.json       # 의존성 및 스크립트
```

## 개발 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm test

# 빌드
npm run build
```

## 개발 원칙

- UI 구현은 실행 코드를 먼저 작성
- 코어 비즈니스 로직은 TDD로 구현
- Mantine UI Kit 컴포넌트 활용
- 상태 관리는 React Context + useReducer 사용
- 초기 구현은 LocalStorage 기반, 추후 백엔드 API 연동
