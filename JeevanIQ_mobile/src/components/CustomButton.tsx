import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Colors from '../utils/colors';
import Fonts from '../utils/fonts';
import D from '../utils/dimensions';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 80 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    styles[variant],
    isDisabled && styles.disabled,
    style,
  ];

  const labelStyle = [
    styles.baseText,
    styles[`${variant}Text` as keyof typeof styles],
    isDisabled && styles.disabledText,
    textStyle,
  ];

  return (
    <AnimatedTouchable
      style={[animatedStyle, containerStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={isDisabled}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.white : Colors.primary}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={labelStyle}>{title}</Text>
          {rightIcon}
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: D.radius.lg,
    paddingVertical: D.spacing.md,
    paddingHorizontal: D.spacing.xl,
    minHeight: 52,
    gap: 8,
  },
  baseText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.base,
    letterSpacing: 0.4,
  },

  // ─── Variants ─────────────────────────────────────────────
  primary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryText: {
    color: Colors.white,
  },

  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  outlineText: {
    color: Colors.primary,
  },

  ghost: {
    backgroundColor: Colors.transparent,
  },
  ghostText: {
    color: Colors.textSecondary,
  },

  danger: {
    backgroundColor: Colors.errorMuted,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  dangerText: {
    color: Colors.error,
  },

  // ─── Disabled ─────────────────────────────────────────────
  disabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {},
});

export default CustomButton;