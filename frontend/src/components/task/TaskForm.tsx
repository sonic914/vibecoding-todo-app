import React, { useState } from 'react';
import { Paper, TextInput, Button, Flex, Stack, Select, Transition } from '@mantine/core';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { useTaskContext } from '@/contexts/taskContext/TaskContext';
import { TaskFactory } from '@/domain/task/TaskFactory';
import { TaskStatus } from '@/domain/task/Task';

/**
 * 할 일 추가 폼 컴포넌트
 */
export const TaskForm: React.FC = () => {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 할 일 추가 제출 핸들러
    const handleReset = () => {
    setTitle('');
    setStatus(TaskStatus.TODO);
  };

  // 할 일 추가 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 새로운 할 일 생성
      const newTask = TaskFactory.create({
        title: title.trim(),
        description: ''
      });
      
      // 할 일 추가
      addTask(newTask);
      
      // 폼 초기화
      setTitle('');
      setStatus(TaskStatus.TODO);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition mounted={true} transition="fade" duration={300} timingFunction="ease">
      {(styles) => (
        <Paper shadow="xs" p="md" withBorder mb="md" style={styles}>
          <form onSubmit={handleSubmit} data-testid="task-form">
            <Stack>
              <TextInput
                label="할 일"
                placeholder="할 일을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                data-testid="task-title-input"
                aria-label="할 일 제목"
                autoComplete="off"
                size="md"
              />
              
              <Select
                label="상태"
                value={status}
                onChange={(value) => setStatus(value as TaskStatus)}
                data={[
                  { value: TaskStatus.TODO, label: '할 일' },
                  { value: TaskStatus.IN_PROGRESS, label: '진행 중' },
                  { value: TaskStatus.DONE, label: '완료' }
                ]}
                data-testid="task-status-select"
                aria-label="할 일 상태"
                clearable={false}
                size="md"
              />
              
              <Flex gap="sm" justify="flex-end" mt="md">
                <Button
                  variant="default"
                  onClick={handleReset}
                  leftSection={<IconRefresh size={14} />}
                  data-testid="task-reset-btn"
                >
                  다시 작성
                </Button>
                <Button
                  type="submit"
                  disabled={!title.trim() || isSubmitting}
                  loading={isSubmitting}
                  data-testid="task-submit-btn"
                  leftSection={<IconPlus size={14} />}
                >
                  할 일 추가
                </Button>
              </Flex>
            </Stack>
          </form>
        </Paper>
      )}
    </Transition>
  );
};
