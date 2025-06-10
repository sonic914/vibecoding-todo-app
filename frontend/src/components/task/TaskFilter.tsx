import React, { useState, useEffect } from 'react';
import { Group, SegmentedControl, TextInput, Button, Paper } from '@mantine/core';
import { IconSearch, IconFilterOff } from '@tabler/icons-react';
import { useTaskContext } from '@/contexts/taskContext/TaskContext';
import { TaskStatus } from '@/domain/task/Task';

/**
 * 할 일 필터링 컴포넌트
 */
export const TaskFilter: React.FC = () => {
  const { state, setFilter, clearFilter } = useTaskContext();
  const [status, setStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // 필터 상태 변경 시 필터 적용
  useEffect(() => {
    if (status) {
      setFilter({ 
        ...state.filter,
        status: status as TaskStatus 
      });
    } else if (state.filter.status) {
      // status가 null이고 이전에 status 필터가 설정되어 있었다면 status 필터만 제거
      const { status: _, ...restFilter } = state.filter;
      setFilter(restFilter);
    }
  }, [status, setFilter, state.filter]);

  // 검색어 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      setFilter({
        ...state.filter,
        searchTerm: searchTerm.trim()
      });
    } else if (state.filter.searchTerm) {
      // 검색어가 비어있고 이전에 검색어 필터가 설정되어 있었다면 검색어 필터만 제거
      const { searchTerm: _, ...restFilter } = state.filter;
      setFilter(restFilter);
    }
  };

  // 필터 초기화 핸들러
  const handleClearFilter = () => {
    clearFilter();
    setStatus('');
    setSearchTerm('');
  };

  return (
    <Paper shadow="xs" p="md" withBorder mb="md">
      <Group align="flex-end" justify="space-between">
        <SegmentedControl
          value={status}
          onChange={setStatus}
          data={[
            { label: '전체', value: '' },
            { label: '할 일', value: TaskStatus.TODO },
            { label: '진행 중', value: TaskStatus.IN_PROGRESS },
            { label: '완료', value: TaskStatus.DONE }
          ]}
          data-testid="task-status-filter"
        />
        
        <form onSubmit={handleSearchSubmit} style={{ flexGrow: 1, marginLeft: 16 }}>
          <Group>
            <TextInput
              placeholder="검색어 입력"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flexGrow: 1 }}
              rightSection={
                <Button 
                  type="submit" 
                  variant="subtle" 
                  size="xs"
                  aria-label="검색"
                >
                  <IconSearch size={16} />
                </Button>
              }
              data-testid="task-search-input"
            />
            
            <Button
              variant="light"
              leftSection={<IconFilterOff size={16} />}
              onClick={handleClearFilter}
              aria-label="필터 초기화"
              data-testid="task-filter-clear-btn"
            >
              초기화
            </Button>
          </Group>
        </form>
      </Group>
    </Paper>
  );
};
