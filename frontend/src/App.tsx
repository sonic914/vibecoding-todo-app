import { AppShell, Container, Title, Text, Group, ActionIcon, useMantineColorScheme, Stack, Button, Tooltip, rem } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useEffect } from 'react';
import { loadThemeFromStorage, saveThemeToStorage, getSystemTheme } from '@/utils/themeUtils';
import { TaskProvider, useTaskContext } from '@/contexts/taskContext/TaskContext';
import { TaskForm } from '@/components/task/TaskForm';
import { TaskFilter } from '@/components/task/TaskFilter';
import { TaskList } from '@/components/task/TaskList';

/**
 * Undo 버튼 컴포넌트
 */
const UndoButton = () => {
  const { undo, state } = useTaskContext();
  const { canUndo } = state;
  
  return (
    <Tooltip label={canUndo ? "이전 상태로 되돌리기" : "이전 상태가 없습니다"} disabled={!canUndo}>
      <Button
        variant="filled"
        size="md"
        onClick={undo}
        disabled={!canUndo}
        aria-label="실행 취소"
        className="fade-in"
        data-testid="undo-button"
        style={{ minWidth: '200px' }}
        color="blue"
      >
        실행 취소
      </Button>
    </Tooltip>
  );
};

/**
 * 메인 앱 컴포넌트
 */
function App() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  // 초기 테마 설정 로드
  useEffect(() => {
    const savedTheme = loadThemeFromStorage();
    if (savedTheme) {
      setColorScheme(savedTheme);
    } else {
      // 저장된 테마가 없으면 시스템 테마 사용
      setColorScheme(getSystemTheme());
    }
  }, [setColorScheme]);

  const toggleColorScheme = () => {
    const newColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newColorScheme);
    saveThemeToStorage(newColorScheme);
  };

  return (
    <TaskProvider>
      <AppShell header={{ height: 60 }}>
        <AppShell.Header>
          <Container size="lg" h="100%" className="responsive-container">
            <Group justify="space-between" h="100%" wrap="nowrap">
              <Title order={1} size="h3" style={{ whiteSpace: 'nowrap' }}>TODO 앱</Title>
              <Tooltip label={colorScheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}>
                <ActionIcon 
                  variant="subtle" 
                  onClick={toggleColorScheme} 
                  aria-label="테마 전환"
                  size="lg"
                  className="btn-effect"
                >
                  {colorScheme === 'dark' ? <IconSun size={rem(18)} /> : <IconMoon size={rem(18)} />}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Main>
          <Container size="lg" className="responsive-container">
            <Stack gap="md">
              <div>
                <Title order={2} mb="md">할 일 관리</Title>
                <Text mb="xl" c="dimmed">
                  Clean Architecture와 TDD를 기반으로 개발된 TODO 앱입니다.
                  할 일을 추가, 수정, 삭제하고 상태별로 필터링할 수 있습니다.
                </Text>
              </div>
              
              {/* 할 일 추가 폼 */}
              <TaskForm />
              
              {/* 할 일 필터링 */}
              <TaskFilter />
              
              {/* 할 일 목록 */}
              <TaskList />
              
              {/* 실행 취소 버튼 */}
              <Group justify="center" mt="md">
                <UndoButton />
              </Group>
            </Stack>
          </Container>
        </AppShell.Main>
      </AppShell>
    </TaskProvider>
  );
}

export default App;
