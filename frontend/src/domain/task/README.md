# Task 도메인

이 디렉토리는 할 일(Task) 도메인 모델과 관련 타입을 포함합니다.

## 구조

- `Task.ts`: 할 일 엔티티 타입 정의
- `TaskFactory.ts`: 할 일 객체 생성 팩토리
- `TaskValidation.ts`: 할 일 유효성 검사 로직

## 도메인 규칙

- 할 일은 반드시 제목을 가져야 합니다.
- 할 일은 생성 시 기본적으로 'TODO' 상태입니다.
- 할 일의 우선순위는 기본적으로 'MEDIUM'입니다.
- 완료된 할 일은 completedAt 타임스탬프를 가집니다.
