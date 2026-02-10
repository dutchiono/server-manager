// App-wide constants

export const APP_NAME = 'ServerManager';
export const APP_VERSION = '0.1.0';

// Storage keys
export const STORAGE_KEYS = {
  SERVERS: '@servers',
  CREDENTIALS: '@credentials',
  COMMAND_HISTORY: '@command_history',
  AUTH_ENABLED: '@auth_enabled',
  THEME: '@theme',
} as const;

// Default values
export const DEFAULT_SSH_PORT = 22;
export const AUTO_LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes in ms
export const MAX_COMMAND_HISTORY = 100;

// GitHub update checking
export const GITHUB_REPO = 'dutchiono/server-manager';
export const UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

// Server colors for visual identification
export const SERVER_COLORS = [
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#FFEB3B', // Yellow
  '#795548', // Brown
];