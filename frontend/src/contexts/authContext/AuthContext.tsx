import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, signOut as cognitoSignOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
// HubCallback is used for typing the hubListener
import type { HubCallback } from '@aws-amplify/core';
import { clearTokens, saveTokens } from '../../utils/auth/cognitoUtils';

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  login: (idToken: string, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthChannelEventData {
  signInUserSession?: { // This property itself is optional
    idToken?: { jwtToken: string };
    accessToken?: { jwtToken: string };
    refreshToken?: { token: string };
  };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await getCurrentUser();
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();

    const hubListener: HubCallback<'auth'> = (capsule) => {
      const { payload } = capsule;
      const eventName = payload.event;
      // Explicitly cast payload.data as its type is 'any' with the simplified HubCallback
      const eventData = payload.data as AuthChannelEventData | Error | undefined;
      const eventMessage = payload.message;

      switch (eventName) {
        case 'signIn':
        case 'cognitoHostedUI':
          console.log('User signed in via Hub:', eventData);
          setIsLoggedIn(true);
          setLoading(false);
          if (eventData && typeof eventData === 'object' && 'signInUserSession' in eventData) {
            // eventData.signInUserSession is potentially undefined due to its optional nature
            const session = (eventData as AuthChannelEventData).signInUserSession;
            if (session) { // Check if session object exists
              const { idToken, accessToken, refreshToken } = session;
              if (idToken?.jwtToken && accessToken?.jwtToken && refreshToken?.token) {
                saveTokens(idToken.jwtToken, accessToken.jwtToken, refreshToken.token);
                console.log('Tokens saved from Hosted UI.');
              } else {
                console.warn('One or more tokens were missing from signInUserSession.');
              }
            } else {
              console.warn('signInUserSession property was present in eventData but its value was undefined/null.');
            }
          }
          break;
        case 'signOut':
          console.log('User signed out via Hub');
          setIsLoggedIn(false);
          clearTokens();
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.error('Sign in failure via Hub. Message:', eventMessage, 'Data:', eventData);
          let errorMessage = 'Unknown error';
          if (eventMessage) {
            errorMessage = eventMessage;
          } else if (eventData instanceof Error) {
            errorMessage = eventData.message;
          }
          setError('로그인에 실패했습니다: ' + errorMessage);
          setIsLoggedIn(false);
          setLoading(false);
          break;
        default:
          break;
      }
    };

    const unsubscribe = Hub.listen('auth', hubListener);

    return () => {
      unsubscribe();
    };
  }, []);

  const login = (idToken: string, accessToken: string, refreshToken: string) => {
    try {
      saveTokens(idToken, accessToken, refreshToken);
      setIsLoggedIn(true);
      setError(null);
      console.log('Manual login successful, tokens stored.');
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const logout = async () => {
    try {
      await cognitoSignOut();
    } catch (err) {
      console.error('로그아웃 오류:', err);
      setError('로그아웃 처리 중 오류가 발생했습니다.');
    }
  };

  const contextValue: AuthContextType = {
    isLoggedIn,
    loading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext는 AuthProvider 내에서 사용해야 합니다.');
  }
  return context;
};
