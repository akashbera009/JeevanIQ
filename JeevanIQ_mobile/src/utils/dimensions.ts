import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

/**
 * Scale a size relative to screen width
 */
export const scale = (size: number): number =>
  (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Scale a size relative to screen height
 */
export const verticalScale = (size: number): number =>
  (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Scale fonts — slightly less aggressive than full scale
 */
export const moderateScale = (size: number, factor = 0.5): number =>
  size + (scale(size) - size) * factor;

export const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

export const BOTTOM_INSET = Platform.OS === 'ios' ? 34 : 0;

const Dimensions_ = {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  scale,
  verticalScale,
  moderateScale,
  STATUSBAR_HEIGHT,
  BOTTOM_INSET,

  // ─── Spacing ─────────────────────────────────────────
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },

  // ─── Border Radius ────────────────────────────────────
  radius: {
    xs: 4,
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    xxl: 28,
    full: 999,
  },

  // ─── Icon Sizes ───────────────────────────────────────
  icon: {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
  },

  // ─── Font Sizes ───────────────────────────────────────
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 26,
    display: 32,
    hero: 40,
  },
};

export default Dimensions_;