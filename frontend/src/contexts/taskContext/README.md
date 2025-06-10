# Task Context

이 디렉토리는 할 일(Task) 상태 관리를 위한 React Context와 관련 훅을 포함합니다.

## 구조

- `TaskContext.tsx`: 할 일 상태 관리를 위한 React Context 및 Provider
- `useTaskContext.ts`: 할 일 컨텍스트를 사용하기 위한 커스텀 훅
- `__tests__/`: 컨텍스트 및 훅에 대한 테스트 코드

## 개발 원칙

- 컨텍스트는 상태 관리를 위해 useReducer와 함께 사용합니다.
- 모든 비즈니스 로직은 TDD 방식으로 구현합니다.
- 컨텍스트 Provider는 애플리케이션의 최상위 레벨에서 제공됩니다.
- 컨텍스트 사용은 커스텀 훅을 통해 추상화합니다.
