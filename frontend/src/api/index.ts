import { ApiClient } from './apiClient';
import { TaskService } from './taskService';
import { API_CONFIG } from '../config/api';

// API 클라이언트 인스턴스 생성
export const apiClient = new ApiClient({
  baseUrl: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Task API 서비스 인스턴스 생성
export const taskService = new TaskService(apiClient);

// API 서비스 내보내기
export * from './types';
export * from './apiClient';
export * from './taskService';
