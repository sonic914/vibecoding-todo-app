import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles/global.css';
import App from './App';

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
