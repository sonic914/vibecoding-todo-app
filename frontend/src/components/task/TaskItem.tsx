import React, { useState } from 'react';
import { Paper, Group, Text, ActionIcon, Badge, Stack, TextInput, Button, Tooltip, useMantineColorScheme, rem, Flex } from '@mantine/core';
import { IconEdit, IconTrash, IconCheck, IconX, IconDeviceFloppy } from '@tabler/icons-react';
import { useTaskContext } from '@/contexts/taskContext/TaskContext';
import { Task, TaskStatus, UpdateTaskDTO } from '@/domain/task/Task';
import { formatDate } from '../../utils/dateUtils';

interface TaskItemProps {
  task: Task;
  index?: number;
}

/**
 * 개별 할 일 항목을 표시하는 컴포넌트
 */
export const TaskItem: React.FC<TaskItemProps> = ({ task, index = 0 }) => {
  const { colorScheme } = useMantineColorScheme();
  // index를 사용하여 애니메이션 지연 효과 계산
  const animationDelay = index * 50;
  const { updateTask, deleteTask, completeTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  // 할 일 상태에 따른 배지 색상
  const getBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'blue';
      case TaskStatus.IN_PROGRESS:
        return 'yellow';
      case TaskStatus.DONE:
        return 'green';
      default:
        return 'gray';
    }
  };

  // 할 일 수정 시작
  const handleEditStart = () => {
    setEditTitle(task.title);
    setIsEditing(true);
  };

  // 할 일 수정 취소
  const handleEditCancel = () => {
    setIsEditing(false);
  };

  // 할 일 수정 저장
  const handleEditSave = () => {
    if (editTitle.trim()) {
      const updates: UpdateTaskDTO = {
        title: editTitle.trim()
      };
      updateTask(task.id, updates);
      setIsEditing(false);
    }
  };

  // 할 일 삭제
  const handleDelete = () => {
    deleteTask(task.id);
  };

  // 할 일 완료/미완료 토글
  const handleToggleComplete = () => {
    completeTask(task.id);
  };

  // 수정 모드
  if (isEditing) {
    return (
      <Paper 
        shadow="xs" 
        p="md" 
        withBorder 
        data-testid="task-item"
        style={{ position: 'relative' }}
      >
        <Stack>
          <TextInput
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="할 일 제목"
            autoFocus
            data-testid="task-edit-input"
            aria-label="할 일 제목 수정"
          />
          <Flex gap="sm" justify="flex-end" mt="md">
            <Button
              variant="default"
              onClick={handleEditCancel}
              leftSection={<IconX size={14} />}
              aria-label="수정 취소"
              data-testid="task-edit-cancel-btn"
            >
              취소
            </Button>
            <Button
              onClick={handleEditSave}
              leftSection={<IconDeviceFloppy size={14} />}
              aria-label="수정 저장"
              data-testid="task-edit-save-btn"
            >
              저장
            </Button>
          </Flex>
        </Stack>
      </Paper>
    );
  }

  // 일반 모드
  return (
    <Paper 
      shadow="xs" 
      p="md" 
      withBorder 
      data-testid="task-item"
      style={{ 
        position: 'relative',
        transition: 'all 0.2s ease',
        animationDelay: `${animationDelay}ms`
      }}
      className={`task-item-hover fade-in ${task.status === TaskStatus.DONE ? 'task-completed' : ''}`}
    >
      <Group justify="space-between" wrap="nowrap">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Group gap="xs" wrap="wrap">
            <Text 
              fw={500} 
              data-testid="task-title"
              style={{ 
                textDecoration: task.status === TaskStatus.DONE ? 'line-through' : 'none',
                opacity: task.status === TaskStatus.DONE ? 0.8 : 1
              }}
            >
              {task.title}
            </Text>
            <Badge 
              color={getBadgeColor(task.status)} 
              data-testid="task-status"
              variant={colorScheme === 'dark' ? 'light' : 'filled'}
            >
              {task.status === TaskStatus.TODO ? '할 일' : 
               task.status === TaskStatus.IN_PROGRESS ? '진행 중' : '완료'}
            </Badge>
          </Group>
          <Text size="xs" c="dimmed">
            생성: {formatDate(task.createdAt)}
            {task.completedAt && ` | 완료: ${formatDate(task.completedAt)}`}
          </Text>
        </Stack>
        <Group gap="xs">
          <Tooltip label={task.status === TaskStatus.DONE ? "미완료로 표시" : "완료로 표시"}>
            <ActionIcon
              color={task.status === TaskStatus.DONE ? "orange" : "green"}
              onClick={handleToggleComplete}
              aria-label={task.status === TaskStatus.DONE ? "미완료로 표시" : "완료로 표시"}
              data-testid="task-complete-btn"
              variant="light"
            >
              <IconCheck size={rem(16)} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="수정">
            <ActionIcon
              color="blue"
              onClick={handleEditStart}
              aria-label="수정"
              data-testid="task-edit-btn"
              variant="light"
            >
              <IconEdit size={rem(16)} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="삭제">
            <ActionIcon
              color="red"
              onClick={handleDelete}
              aria-label="삭제"
              data-testid="task-delete-btn"
              variant="light"
            >
              <IconTrash size={rem(16)} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
};
