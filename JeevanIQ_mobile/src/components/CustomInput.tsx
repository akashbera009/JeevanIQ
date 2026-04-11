import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
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

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: 'phone' | 'email' | 'lock' | 'user' | 'search';
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  onRightIconPress?: () => void;
}

const ICONS: Record<string, string> = {
  phone: '📱',
  email: '✉',
  lock: '🔒',
  user: '👤',
  search: '🔍',
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  onRightIconPress,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);

  const borderColor = useSharedValue(Colors.border);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const handleFocus = () => {
    setFocused(true);
    borderColor.value = withTiming(error ? Colors.error : Colors.primary, { duration: 200 });
    inputProps.onFocus?.({} as any);
  };

  const handleBlur = () => {
    setFocused(false);
    borderColor.value = withTiming(error ? Colors.error : Colors.border, { duration: 200 });
    inputProps.onBlur?.({} as any);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Animated.View
        style={[
          styles.inputContainer,
          animatedBorderStyle,
          error ? styles.inputContainerError : null,
        ]}>
        {leftIcon ? (
          <View style={styles.leftIconContainer}>
            <Text style={styles.iconEmoji}>{ICONS[leftIcon]}</Text>
          </View>
        ) : null}

        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeft : null,
            rightIcon ? styles.inputWithRight : null,
          ]}
          placeholderTextColor={Colors.textMuted}
          selectionColor={Colors.primary}
          cursorColor={Colors.primary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...inputProps}
        />

        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconContainer}
            activeOpacity={0.7}>
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </Animated.View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: D.spacing.base,
  },
  label: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1.5,
    borderRadius: D.radius.md,
    borderColor: Colors.border,
    minHeight: 52,
    overflow: 'hidden',
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  leftIconContainer: {
    paddingLeft: D.spacing.md,
    paddingRight: 4,
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 16,
  },
  rightIconContainer: {
    paddingHorizontal: D.spacing.md,
    justifyContent: 'center',
    height: '100%',
  },
  input: {
    flex: 1,
    fontFamily: Fonts.Medium,
    fontSize: D.fontSize.base,
    color: Colors.textPrimary,
    paddingHorizontal: D.spacing.md,
    paddingVertical: D.spacing.md,
  },
  inputWithLeft: {
    paddingLeft: 6,
  },
  inputWithRight: {
    paddingRight: 0,
  },
  errorText: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.error,
    marginTop: 5,
    marginLeft: 2,
  },
  hintText: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 5,
    marginLeft: 2,
  },
});

export default CustomInput;