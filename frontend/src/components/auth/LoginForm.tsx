import React, { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Box, Alert, Divider, Stack } from '@mantine/core'; // Divider, Stack 추가
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { signIn, fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth'; // signInWithRedirect 추가
import { saveTokens } from '../../utils/auth/cognitoUtils';
import { useAuthContext } from '../../contexts/authContext/AuthContext';

// 로그인 폼 속성 인터페이스
interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// 로그인 폼 데이터 인터페이스
interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * 로그인 폼 컴포넌트
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  // Google 로그인 핸들러
  const handleGoogleSignIn = async () => {
    setLoading(true); // 로딩 상태 표시 (선택 사항)
    setError(null);
    try {
      // Amplify v6: signInWithRedirect 사용
      await signInWithRedirect({ provider: 'Google' });
      // signInWithRedirect는 페이지를 리디렉션하므로, 성공 콜백은 리디렉션 후 처리됩니다.
    } catch (err) {
      console.error('Google 로그인 오류:', err);
      let errorMessage = 'Google 로그인에 실패했습니다.';
      if (err instanceof Error) {
        errorMessage = err.message;
        if (onError) {
          onError(err);
        }
      }
      setError(errorMessage);
      setLoading(false); // 오류 발생 시 로딩 상태 해제
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthContext();

  // 폼 초기화
  const form = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : '유효한 이메일을 입력하세요'),
      password: (value: string) => (value.length >= 8 ? null : '비밀번호는 최소 8자 이상이어야 합니다'),
    },
  });

  // 폼 제출 핸들러
  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Cognito 로그인 시도 (Amplify v6 API 사용)
      await signIn({
        username: values.email,
        password: values.password
      });
      
      // 세션 가져오기
      const authSession = await fetchAuthSession();
      
      // 토큰 추출
      const idToken = authSession.tokens?.idToken?.toString() || '';
      const accessToken = authSession.tokens?.accessToken?.toString() || '';
      // Amplify v6에서는 refreshToken에 다른 방식으로 접근해야 함
      // 임시로 비어있는 문자열 사용
      const refreshToken = '';
      
      // 토큰 저장
      saveTokens(idToken, accessToken, refreshToken);
      
      // 인증 컨텍스트 업데이트
      login(idToken, accessToken, refreshToken);

      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      let errorMessage = '로그인에 실패했습니다';
      
      if (err instanceof Error) {
        // Cognito 오류 메시지 처리
        switch (err.name) {
          case 'UserNotFoundException':
            errorMessage = '존재하지 않는 사용자입니다';
            break;
          case 'NotAuthorizedException':
            errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다';
            break;
          case 'UserNotConfirmedException':
            errorMessage = '이메일 인증이 필요합니다';
            break;
          default:
            errorMessage = err.message;
        }
        
        // 오류 콜백 호출
        if (onError) {
          onError(err);
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={400} mx="auto">
      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="로그인 오류"
          color="red"
          mb="md"
        >
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            required
            label="이메일"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            required
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            {...form.getInputProps('password')}
          />

          <Group justify="flex-end" mt="xs">
            <Button type="submit" loading={loading}>
              로그인
            </Button>
          </Group>
        </Stack>
      </form>

      <Divider label="또는" labelPosition="center" my="lg" />

      <Button
        fullWidth
        variant="outline"
        onClick={handleGoogleSignIn}
        loading={loading} // 이메일/비번 로그인과 로딩 상태 공유 가능
      >
        Google 계정으로 로그인
      </Button>
    </Box>
  );
};
