import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../utils/hooks';
import { clearToast } from '../modals';
import Colors from '../utils/colors';
import Fonts from '../utils/fonts';
import D from '../utils/dimensions';
import { ToastType } from '../utils/types';

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
};

const TOAST_COLORS: Record<ToastType, string> = {
  success: Colors.success,
  error: Colors.error,
  warning: Colors.warning,
  info: Colors.info,
};

const TOAST_BG: Record<ToastType, string> = {
  success: Colors.successMuted,
  error: Colors.errorMuted,
  warning: Colors.warningMuted,
  info: Colors.infoMuted,
};

const ToastContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(s => s.ui.toast);
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (toast) {
      translateY.value = withSpring(0, { damping: 16, stiffness: 180 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(-100, { duration: 300 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [toast]);

  if (!toast) return null;

  const accentColor = TOAST_COLORS[toast.type];
  const bgColor = TOAST_BG[toast.type];
  const icon = TOAST_ICONS[toast.type];

  return (
    <Animated.View
      style={[
        styles.container,
        { top: insets.top + D.spacing.sm },
        animatedStyle,
      ]}>
      <View style={[styles.toast, { backgroundColor: bgColor, borderColor: accentColor }]}>
        {/* Icon badge */}
        <View style={[styles.iconBadge, { backgroundColor: accentColor }]}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>

        {/* Message */}
        <Text style={[styles.message, { color: accentColor }]} numberOfLines={2}>
          {toast.message}
        </Text>

        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: D.spacing.base,
    right: D.spacing.base,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: D.radius.lg,
    borderWidth: 1,
    paddingVertical: D.spacing.md,
    paddingHorizontal: D.spacing.md,
    gap: D.spacing.sm,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: D.radius.lg,
    borderBottomLeftRadius: D.radius.lg,
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: D.spacing.sm,
  },
  iconText: {
    color: Colors.white,
    fontFamily: Fonts.Bold,
    fontSize: 12,
  },
  message: {
    flex: 1,
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.sm,
    lineHeight: 18,
  },
});

export default ToastContainer;