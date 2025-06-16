import React, { useState } from 'react';
import { Container, Tabs, Title, Text, Paper, Box } from '@mantine/core';
import { LoginForm } from '../../components/auth/LoginForm';
import { SignupForm } from '../../components/auth/SignupForm';
import { useAuthContext } from '../../contexts/authContext/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * 인증 페이지 (로그인/회원가입)
 */
export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('login');
  const { login } = useAuthContext();
  const navigate = useNavigate();

  // 로그인 성공 핸들러
  const handleLoginSuccess = () => {
    // 홈 페이지로 리디렉션
    navigate('/');
  };

  // 회원가입 성공 핸들러
  const handleSignupSuccess = () => {
    // 로그인 탭으로 전환
    setActiveTab('login');
  };

  return (
    <Container size="sm" py="xl">
      <Box mb="xl" ta="center">
        <Title order={1}>할 일 관리 앱</Title>
        <Text c="dimmed" mt="md">
          로그인하거나 회원가입하여 할 일을 관리하세요.
        </Text>
      </Box>

      <Paper shadow="md" radius="md" p="xl">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List grow>
            <Tabs.Tab value="login">로그인</Tabs.Tab>
            <Tabs.Tab value="signup">회원가입</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login" pt="xl">
            <LoginForm onSuccess={handleLoginSuccess} />
          </Tabs.Panel>

          <Tabs.Panel value="signup" pt="xl">
            <SignupForm onSuccess={handleSignupSuccess} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
};
