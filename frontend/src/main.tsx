import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles/global.css';
import App from './App';
import './config/amplify';
import { Amplify } from 'aws-amplify'; // Main Amplify object for configure
import { Hub } from 'aws-amplify/utils'; // Hub for listening to events
import * as Auth from 'aws-amplify/auth'; // Auth category
import { ConsoleLogger } from 'aws-amplify/utils'; // ConsoleLogger 임포트

// Log Amplify Hub and Auth status right after configuration
console.log('Amplify object after config:', Amplify); // This is fine, Amplify.configure is from here
console.log('Hub object after config:', Hub); // Log imported Hub
console.log('Auth object after config:', Auth); // Log imported Auth module

// Amplify 로거 활성화
ConsoleLogger.LOG_LEVEL = 'DEBUG'; // ConsoleLogger를 통해 로그 레벨 설정

// Amplify 설정 초기화

// 테마 설정
const theme = createTheme({
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: () => ({
        root: {
          transition: 'all 0.2s ease',
          fontWeight: 500,
          border: 'none',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(1px)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          },
        },
        label: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        },
      }),
    },
    SegmentedControl: {
      styles: {
        root: {
          borderRadius: '4px',
        },
        indicator: {
          borderRadius: '3px',
        },
        label: {
          fontWeight: 500,
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
