import React, { useState } from 'react';
import { Paper, TextInput, Button, Group, Stack, Select } from '@mantine/core';
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
    <Paper shadow="xs" p="md" withBorder mb="md">
      <form onSubmit={handleSubmit} data-testid="task-form">
        <Stack>
          <TextInput
            label="할 일"
            placeholder="할 일을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            data-testid="task-title-input"
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
          />
          
          <Group justify="flex-end">
            <Button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              loading={isSubmitting}
              data-testid="task-submit-btn"
            >
              할 일 추가
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};
