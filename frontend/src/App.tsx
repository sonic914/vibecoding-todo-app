import { AppShell, Container, Title, Text, Group, ActionIcon, useMantineColorScheme, Stack, Button, Tooltip } from '@mantine/core';
import { IconSun, IconMoon, IconArrowBackUp } from '@tabler/icons-react';
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
    <Tooltip label="실행 취소" disabled={!canUndo}>
      <Button
        leftSection={<IconArrowBackUp size={16} />}
        variant="light"
        size="xs"
        onClick={undo}
        disabled={!canUndo}
        aria-label="실행 취소"
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

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <TaskProvider>
      <AppShell header={{ height: 60 }}>
        <AppShell.Header>
          <Container size="lg" h="100%">
            <Group justify="space-between" h="100%">
              <Title order={1} size="h3">TODO 앱</Title>
              <ActionIcon 
                variant="subtle" 
                onClick={toggleColorScheme} 
                aria-label="테마 전환"
              >
                {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Main>
          <Container size="lg" py="xl">
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
              
              {/* 할 일 필터링 및 Undo 버튼 */}
              <Group justify="space-between" align="center">
                <TaskFilter />
                <UndoButton />
              </Group>
              
              {/* 할 일 목록 */}
              <TaskList />
            </Stack>
          </Container>
        </AppShell.Main>
      </AppShell>
    </TaskProvider>
  );
}

export default App;
