import { ApiConfig, ApiError } from './types';
import { getIdToken, isAuthenticated } from '../utils/auth/cognitoUtils';

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  private getAuthHeader(): Record<string, string> {
    // Cognito ID 토큰 가져오기
    const token = getIdToken();
    
    // 인증되지 않은 경우 빈 객체 반환
    if (!token || !isAuthenticated()) {
      console.warn('인증 토큰이 없거나 만료되었습니다.');
      return {};
    }
    
    return { Authorization: `Bearer ${token}` };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Unknown error occurred',
      }));
      
      const error: ApiError = {
        message: errorData.message || `Error: ${response.statusText}`,
        statusCode: response.status,
      };
      
      throw error;
    }

    const data = await response.json();
    return data;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
      },
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
      },
    });

    return this.handleResponse<T>(response);
  }
}
