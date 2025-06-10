import React from 'react';
import { Stack, Text, Center, Loader } from '@mantine/core';
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
      <Center py="xl">
        <Loader size="md" />
      </Center>
    );
  }

  // 에러가 발생한 경우
  if (error) {
    return (
      <Center py="xl">
        <Text color="red">{error}</Text>
      </Center>
    );
  }

  // 할 일이 없는 경우
  if (filteredTasks.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed">
          {tasks.length === 0 
            ? '할 일이 없습니다. 새로운 할 일을 추가해보세요!' 
            : '필터 조건에 맞는 할 일이 없습니다.'}
        </Text>
      </Center>
    );
  }

  // 할 일 목록 표시
  return (
    <Stack gap="md" data-testid="task-list">
      {filteredTasks.map((task: Task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </Stack>
  );
};
