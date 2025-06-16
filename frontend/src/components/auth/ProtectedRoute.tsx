import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext/AuthContext';
import { LoadingOverlay } from '@mantine/core';

/**
 * 보호된 라우트 컴포넌트
 * 인증되지 않은 사용자는 로그인 페이지로 리디렉션
 */
export const ProtectedRoute: React.FC = () => {
  const { isLoggedIn, loading } = useAuthContext();

  // 로딩 중일 때는 로딩 오버레이 표시
  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  // 개발 및 테스트 목적으로 인증 검사 우회
  // TODO: 배포 전에 아래 코드를 원래대로 복원해야 함
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  // 인증된 사용자에게 자식 라우트 렌더링
  return <Outlet />;
};
