/**
 * LocalStorageUtils 테스트
 * 
 * 로컬 스토리지 유틸리티 함수들에 대한 테스트 케이스
 */

import { 
  saveToStorage, 
  getFromStorage, 
  removeFromStorage, 
  clearStorage,
  StorageKeys
} from '../LocalStorageUtils';

// 로컬 스토리지 모킹
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string): string | null => {
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string): void => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string): void => {
      delete store[key];
    }),
    clear: jest.fn((): void => {
      store = {};
    })
  };
})();

// 테스트 전에 로컬 스토리지 모킹 설정
beforeEach(() => {
  // 실제 로컬 스토리지 대신 모킹된 버전 사용
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  // 각 테스트 전에 모킹된 함수 호출 기록 초기화
  jest.clearAllMocks();
});

describe('LocalStorageUtils', () => {
  // 저장 테스트
  describe('saveToStorage', () => {
    it('문자열 데이터를 저장해야 함', () => {
      const key = StorageKeys.TASKS;
      const value = 'test-value';
      
      saveToStorage(key, value);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });
    
    it('객체 데이터를 저장해야 함', () => {
      const key = StorageKeys.TASKS;
      const value = { id: '1', name: 'Task 1' };
      
      saveToStorage(key, value);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });
    
    it('배열 데이터를 저장해야 함', () => {
      const key = StorageKeys.TASKS;
      const value = [{ id: '1', name: 'Task 1' }, { id: '2', name: 'Task 2' }];
      
      saveToStorage(key, value);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('저장 중 오류가 발생하면 false를 반환해야 함', () => {
      const key = StorageKeys.TASKS;
      const value = { id: '1', name: 'Task 1' };
      
      // 오류 시뮬레이션
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      const result = saveToStorage(key, value);
      
      expect(result).toBe(false);
    });
  });
  
  // 조회 테스트
  describe('getFromStorage', () => {
    it('문자열 데이터를 조회해야 함', () => {
      const key = StorageKeys.TASKS;
      const value = 'test-value';
      
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(value));
      
      const result = getFromStorage<string>(key);
      
      expect(result).toBe(value);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
    });
    
    it('객체 데이터를 조회해야 함', () => {
      const key = StorageKeys.TASKS;
      const value = { id: '1', name: 'Task 1' };
      
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(value));
      
      const result = getFromStorage<typeof value>(key);
      
      expect(result).toEqual(value);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
    });
    
    it('배열 데이터를 조회해야 함', () => {
      const key = StorageKeys.TASKS;
      const value = [{ id: '1', name: 'Task 1' }, { id: '2', name: 'Task 2' }];
      
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(value));
      
      const result = getFromStorage<typeof value>(key);
      
      expect(result).toEqual(value);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
    });
    
    it('데이터가 없으면 기본값을 반환해야 함', () => {
      const key = StorageKeys.TASKS;
      const defaultValue: string[] = [];
      
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const result = getFromStorage<typeof defaultValue>(key, defaultValue);
      
      expect(result).toEqual(defaultValue);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
    });
    
    it('조회 중 오류가 발생하면 기본값을 반환해야 함', () => {
      const key = StorageKeys.TASKS;
      const defaultValue: string[] = [];
      
      // 오류 시뮬레이션
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      const result = getFromStorage<typeof defaultValue>(key, defaultValue);
      
      expect(result).toEqual(defaultValue);
    });
  });
  
  // 삭제 테스트
  describe('removeFromStorage', () => {
    it('키에 해당하는 데이터를 삭제해야 함', () => {
      const key = StorageKeys.TASKS;
      
      removeFromStorage(key);
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(key);
    });
    
    it('삭제 중 오류가 발생하면 false를 반환해야 함', () => {
      const key = StorageKeys.TASKS;
      
      // 오류 시뮬레이션
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      const result = removeFromStorage(key);
      
      expect(result).toBe(false);
    });
  });
  
  // 스토리지 초기화 테스트
  describe('clearStorage', () => {
    it('모든 데이터를 초기화해야 함', () => {
      clearStorage();
      
      expect(localStorageMock.clear).toHaveBeenCalled();
    });
    
    it('초기화 중 오류가 발생하면 false를 반환해야 함', () => {
      // 오류 시뮬레이션
      localStorageMock.clear.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      const result = clearStorage();
      
      expect(result).toBe(false);
    });
  });
});
