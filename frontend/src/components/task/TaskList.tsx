import React from 'react';
import { Stack, Text, Center, Loader, Paper, Title, Alert, Transition } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTaskContext } from '@/contexts/taskContext/TaskContext';
import { TaskItem } from './TaskItem';
import { Task } from '@/domain/task/Task';

/**
 * 할 일 목록을 표시하는 컴포넌트
 */
export const TaskList: React.FC = () => {
  const { state } = useTaskContext();
  const { tasks, isLoading, error, filter } = state;

  // 필터링된 할 일 목록
  const filteredTasks = React.useMemo(() => {
    if (!filter || Object.keys(filter).length === 0) {
      return tasks;
    }

    return tasks.filter(task => {
      // 상태 필터링
      if (filter.status !== undefined && task.status !== filter.status) {
        return false;
      }
      
      // 검색어 필터링
      if (filter.searchTerm && !task.title.toLowerCase().includes(filter.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [tasks, filter]);

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <Paper shadow="xs" p="xl" withBorder>
        <Center py="xl">
          <Loader size="md" aria-label="로딩 중" />
        </Center>
      </Paper>
    );
  }

  // 에러가 발생한 경우
  if (error) {
    return (
      <Alert title="오류 발생" color="red" icon={<IconInfoCircle />} withCloseButton={false}>
        <Text>{error}</Text>
      </Alert>
    );
  }

  // 할 일이 없는 경우
  if (filteredTasks.length === 0) {
    return (
      <Transition mounted={true} transition="fade" duration={400} timingFunction="ease">
        {(styles) => (
          <Paper shadow="xs" p="xl" withBorder style={styles}>
            <Center py="xl">
              <Text c="dimmed" size="lg" ta="center">
                {tasks.length === 0 
                  ? '할 일이 없습니다. 새로운 할 일을 추가해보세요!' 
                  : '필터 조건에 맞는 할 일이 없습니다.'}
              </Text>
            </Center>
          </Paper>
        )}
      </Transition>
    );
  }

  // 할 일 목록 표시
  return (
    <div role="region" aria-label="할 일 목록" data-testid="task-list">
      <Title order={3} size="h4" mb="md" visually-hidden>
        할 일 목록 ({filteredTasks.length}개)
      </Title>
      <Stack gap="md">
        {filteredTasks.map((task: Task, index: number) => (
          <Transition key={task.id} mounted={true} transition="fade" duration={300} timingFunction="ease">
            {(styles) => (
              <div style={styles}>
                <TaskItem task={task} index={index} />
              </div>
            )}
          </Transition>
        ))}
      </Stack>
    </div>
  );
};
