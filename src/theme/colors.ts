export const colors = {
  // Backgrounds
  background: '#080810',
  backgroundDeep: '#04040a',
  surface: '#0f0f1a',
  surfaceAlt: '#14141f',
  surfaceElevated: '#1a1a2a',
  overlay: 'rgba(8,8,16,0.85)',

  // Gold palette — Art Deco signature
  primary: '#c9a84c',
  primaryLight: '#e8c97a',
  primarySoft: '#e8c97a',        // alias kept for legacy compatibility
  primaryDark: '#8b6914',
  primaryMuted: 'rgba(201,168,76,0.15)',
  primaryGlow: 'rgba(201,168,76,0.08)',
  primaryBorder: 'rgba(201,168,76,0.25)',
  primaryBorderStrong: 'rgba(201,168,76,0.5)',

  // Typography
  textPrimary: '#f5f0e8',
  textSecondary: '#a8a099',
  textMuted: '#5a5560',
  textGold: '#e8c97a',
  textOnGold: '#080810',

  // Borders & dividers
  border: 'rgba(255,255,255,0.06)',
  borderMid: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.15)',

  // Status
  success: '#3fb98f',
  successMuted: 'rgba(63,185,143,0.15)',
  danger: '#d86a6a',
  dangerMuted: 'rgba(216,106,106,0.15)',
  warning: '#e0a035',
  warningMuted: 'rgba(224,160,53,0.15)',

  // Glassmorphism
  glass: 'rgba(15,15,26,0.7)',
  glassBorder: 'rgba(201,168,76,0.12)',
  glassSheen: 'rgba(255,255,255,0.03)',

  // Gradient stops
  gradientGoldStart: '#c9a84c',
  gradientGoldEnd: '#8b6914',
  gradientDarkStart: '#0f0f1a',
  gradientDarkEnd: '#080810',
} as const;

export type Color = keyof typeof colors;
