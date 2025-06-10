/**
 * LocalStorageUtils.ts
 * 
 * 로컬 스토리지 관련 유틸리티 함수들을 제공합니다.
 * 타입 안전성을 보장하기 위해 제네릭 타입을 활용합니다.
 */

/**
 * 로컬 스토리지 키 열거형
 * 애플리케이션에서 사용하는 모든 로컬 스토리지 키를 관리합니다.
 */
export enum StorageKeys {
  TASKS = 'todo-app-tasks',
  FILTER = 'todo-app-filter',
  THEME = 'todo-app-theme',
  USER_PREFERENCES = 'todo-app-user-preferences'
}

/**
 * 로컬 스토리지에 데이터를 저장합니다.
 * 
 * @param key - 저장할 데이터의 키
 * @param value - 저장할 데이터 값
 * @returns 저장 성공 여부
 */
export function saveToStorage<T>(key: StorageKeys, value: T): boolean {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error saving data to localStorage: ${error}`);
    return false;
  }
}

/**
 * 로컬 스토리지에서 데이터를 조회합니다.
 * 
 * @param key - 조회할 데이터의 키
 * @param defaultValue - 데이터가 없을 경우 반환할 기본값
 * @returns 조회된 데이터 또는 기본값
 */
export function getFromStorage<T>(key: StorageKeys, defaultValue?: T): T | null {
  try {
    const serializedValue = localStorage.getItem(key);
    
    if (serializedValue === null) {
      return defaultValue !== undefined ? defaultValue : null;
    }
    
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error(`Error getting data from localStorage: ${error}`);
    return defaultValue !== undefined ? defaultValue : null;
  }
}

/**
 * 로컬 스토리지에서 특정 키의 데이터를 삭제합니다.
 * 
 * @param key - 삭제할 데이터의 키
 * @returns 삭제 성공 여부
 */
export function removeFromStorage(key: StorageKeys): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data from localStorage: ${error}`);
    return false;
  }
}

/**
 * 로컬 스토리지의 모든 데이터를 초기화합니다.
 * 
 * @returns 초기화 성공 여부
 */
export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
    return false;
  }
}

/**
 * 로컬 스토리지에 데이터가 존재하는지 확인합니다.
 * 
 * @param key - 확인할 데이터의 키
 * @returns 데이터 존재 여부
 */
export function hasStorageItem(key: StorageKeys): boolean {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking data in localStorage: ${error}`);
    return false;
  }
}

/**
 * 로컬 스토리지 사용 가능 여부를 확인합니다.
 * 
 * @returns 로컬 스토리지 사용 가능 여부
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}
