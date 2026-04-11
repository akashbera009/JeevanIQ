/**
 * JeevanIQ — Color System
 * Theme: Industrial Medical | Black × Orange
 */

const Colors = {
  // ─── Backgrounds ───────────────────────────────────────────
  background: '#0A0A0A',
  backgroundSecondary: '#111111',
  backgroundCard: '#161616',
  backgroundElevated: '#1C1C1C',
  backgroundOverlay: 'rgba(0,0,0,0.85)',

  // ─── Brand / Accent ────────────────────────────────────────
  primary: '#FF6B00',
  primaryLight: '#FF8C3A',
  primaryDark: '#CC5500',
  primaryMuted: 'rgba(255,107,0,0.15)',
  primaryGlow: 'rgba(255,107,0,0.25)',

  // ─── Text ──────────────────────────────────────────────────
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#606060',
  textInverse: '#0A0A0A',
  textOnPrimary: '#FFFFFF',

  // ─── Borders & Dividers ────────────────────────────────────
  border: '#242424',
  borderLight: '#2E2E2E',
  borderActive: '#FF6B00',
  divider: '#1E1E1E',

  // ─── Status Colors ─────────────────────────────────────────
  success: '#00C48C',
  successMuted: 'rgba(0,196,140,0.15)',
  error: '#FF4444',
  errorMuted: 'rgba(255,68,68,0.15)',
  warning: '#FFB830',
  warningMuted: 'rgba(255,184,48,0.15)',
  info: '#3B9EFF',
  infoMuted: 'rgba(59,158,255,0.15)',

  // ─── Priority / Severity ───────────────────────────────────
  critical: '#FF2D55',
  criticalMuted: 'rgba(255,45,85,0.15)',
  high: '#FF6B00',
  highMuted: 'rgba(255,107,0,0.15)',
  medium: '#FFB830',
  mediumMuted: 'rgba(255,184,48,0.15)',
  low: '#00C48C',
  lowMuted: 'rgba(0,196,140,0.15)',

  // ─── Tab Bar ───────────────────────────────────────────────
  tabBarBackground: '#0F0F0F',
  tabBarActive: '#FF6B00',
  tabBarInactive: '#404040',

  // ─── Misc ──────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  shimmerBase: '#1A1A1A',
  shimmerHighlight: '#252525',

  // ─── Gradients (as tuples for LinearGradient) ──────────────
  gradients: {
    primary: ['#FF6B00', '#CC5500'] as [string, string],
    dark: ['#161616', '#0A0A0A'] as [string, string],
    card: ['#1C1C1C', '#111111'] as [string, string],
    overlay: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)'] as [string, string],
  },
};

export default Colors;