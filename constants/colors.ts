/**
 * Brand colors and light/dark theme palettes for React Native Paper.
 * Provides MD3-compatible themes with custom brand colors, as well as
 * a Colors constant for common named colors used across the app.
 */

import {
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme,
} from 'react-native-paper';

/** Primary brand color - Indigo */
const PRIMARY_COLOR = '#6366f1';

/** Light theme background and surface */
const LIGHT_BACKGROUND = '#ffffff';
const LIGHT_SURFACE = '#f8fafc';

/** Dark theme background and surface */
const DARK_BACKGROUND = '#1a1a2e';
const DARK_SURFACE = '#16213e';

/** Error color used for validation and destructive actions */
const ERROR_COLOR = '#ef4444';

/**
 * Light theme with brand colors.
 * Compatible with React Native Paper's MD3 theme format.
 */
export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: PRIMARY_COLOR,
    primaryContainer: '#e0e7ff',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#312e81',
    background: LIGHT_BACKGROUND,
    surface: LIGHT_SURFACE,
    surfaceVariant: '#e2e8f0',
    onBackground: '#0f172a',
    onSurface: '#1e293b',
    onSurfaceVariant: '#64748b',
    error: ERROR_COLOR,
    errorContainer: '#fee2e2',
    onError: '#ffffff',
    onErrorContainer: '#7f1d1d',
    outline: '#94a3b8',
    outlineVariant: '#cbd5e1',
  },
};

/**
 * Dark theme with brand colors.
 * Compatible with React Native Paper's MD3 theme format.
 */
export const DarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#818cf8',
    primaryContainer: '#4338ca',
    onPrimary: '#312e81',
    onPrimaryContainer: '#e0e7ff',
    background: DARK_BACKGROUND,
    surface: DARK_SURFACE,
    surfaceVariant: '#1e293b',
    onBackground: '#f1f5f9',
    onSurface: '#e2e8f0',
    onSurfaceVariant: '#94a3b8',
    error: '#f87171',
    errorContainer: '#7f1d1d',
    onError: '#450a0a',
    onErrorContainer: '#fecaca',
    outline: '#64748b',
    outlineVariant: '#334155',
  },
};

/**
 * Common named colors for use across the app.
 * Provides semantic and utility color tokens beyond the theme.
 */
export const Colors = {
  /** Primary brand color */
  primary: PRIMARY_COLOR,

  /** Light theme colors */
  light: {
    background: LIGHT_BACKGROUND,
    surface: LIGHT_SURFACE,
    text: '#1e293b',
    textSecondary: '#64748b',
  },

  /** Dark theme colors */
  dark: {
    background: DARK_BACKGROUND,
    surface: DARK_SURFACE,
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
  },

  /** Error and semantic colors */
  error: ERROR_COLOR,
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#3b82f6',

  /** Neutral grays */
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;
