import React, { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Box, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { signUp } from 'aws-amplify/auth';

// 회원가입 폼 속성 인터페이스
interface SignupFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// 회원가입 폼 데이터 인터페이스
interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * 회원가입 폼 컴포넌트
 */
export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 초기화
  const form = useForm<SignupFormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value) => (value.length >= 2 ? null : '이름은 최소 2자 이상이어야 합니다'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : '유효한 이메일을 입력하세요'),
      password: (value) => (value.length >= 8 ? null : '비밀번호는 최소 8자 이상이어야 합니다'),
      confirmPassword: (value, values) =>
        value === values.password ? null : '비밀번호가 일치하지 않습니다',
    },
  });

  // 폼 제출 핸들러
  const handleSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Amplify v6 API를 사용한 Cognito 회원가입 구현
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: values.email,
        password: values.password,
        options: {
          userAttributes: {
            name: values.name,
            email: values.email
          },
          // 자동으로 확인 메일 발송
          autoSignIn: true
        }
      });
      
      console.log('회원가입 완료:', { isSignUpComplete, userId, nextStep });
      
      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('회원가입 오류:', err);
      let errorMessage = '회원가입에 실패했습니다';
      
      if (err instanceof Error) {
        // Cognito 오류 메시지 처리
        switch (err.name) {
          case 'UsernameExistsException':
            errorMessage = '이미 사용 중인 이메일 주소입니다';
            break;
          case 'InvalidPasswordException':
            errorMessage = '비밀번호 정책에 맞지 않습니다. 숫자, 특수문자, 대문자를 포함해야 합니다';
            break;
          case 'InvalidParameterException':
            errorMessage = '입력한 파라미터가 유효하지 않습니다';
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
          title="회원가입 오류"
          color="red"
          mb="md"
        >
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="이름"
          placeholder="홍길동"
          {...form.getInputProps('name')}
          mb="md"
        />

        <TextInput
          required
          label="이메일"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
          mb="md"
        />

        <PasswordInput
          required
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          {...form.getInputProps('password')}
          mb="md"
        />

        <PasswordInput
          required
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          {...form.getInputProps('confirmPassword')}
          mb="xl"
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={loading}>
            회원가입
          </Button>
        </Group>
      </form>
    </Box>
  );
};
