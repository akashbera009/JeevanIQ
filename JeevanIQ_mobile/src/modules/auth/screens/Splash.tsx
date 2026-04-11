import React, { useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../utils/types';
import { ScreenNames } from '../../../utils/screenNames';
import Colors from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import { getAccessToken, getUser } from '../../../utils/mmkvStorage';
import { useAppDispatch } from '../../../utils/hooks';
import { setToken, setUser, setAuthenticated } from '../authSlice';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Splash'>;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  // ─── Animations ──────────────────────────────────────────
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.6);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const lineWidth = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: `${lineWidth.value}%` as any,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const navigateNext = async () => {
    const token = await getAccessToken();
    const user = await getUser();

    if (token && user) {
      dispatch(setToken({ access: token, refresh: '' }));
      dispatch(setUser(user));
      dispatch(setAuthenticated(true));
      // RootNavigator will handle redirect to BottomTab
    } else {
      navigation.replace(ScreenNames.LOGIN);
    }
  };

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor(Colors.background);

    // Logo entrance
    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    logoScale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.4)) });

    // Pulse animation
    pulseScale.value = withDelay(
      700,
      withSequence(
        withTiming(1.08, { duration: 400 }),
        withTiming(1, { duration: 400 }),
      ),
    );

    // Title entrance
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(
      500,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }),
    );

    // Orange line
    lineWidth.value = withDelay(800, withTiming(100, { duration: 600 }));

    // Tagline
    taglineOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));

    // Wait for animation then navigate
    const timeout = setTimeout(() => {
      navigateNext();
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Background glow */}
      <View style={styles.glowContainer}>
        <View style={styles.glow} />
      </View>

      {/* Logo mark */}
      <Animated.View style={[styles.logoContainer, pulseStyle]}>
        <Animated.View style={[styles.logoWrapper, logoStyle]}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>+</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* App Name */}
      <Animated.Text style={[styles.appName, titleStyle]}>
        {'Jeevan'}
        <Text style={styles.appNameAccent}>{'IQ'}</Text>
      </Animated.Text>

      {/* Accent Line */}
      <Animated.View style={[styles.accentLine, lineStyle]} />

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, taglineStyle]}>
        Intelligent Patient Flow
      </Animated.Text>

      {/* Bottom version */}
      <View style={styles.bottomContainer}>
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    top: '20%',
    alignItems: 'center',
    width: '100%',
  },
  glow: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryGlow,
    opacity: 0.4,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  logoIconText: {
    color: Colors.white,
    fontSize: 48,
    fontFamily: Fonts.Bold,
  },
  appName: {
    fontSize: 40,
    color: Colors.textPrimary,
    fontFamily: Fonts.Bold,
    letterSpacing: 1,
  },
  appNameAccent: {
    color: Colors.primary,
  },
  accentLine: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 16,
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontFamily: Fonts.Medium,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
  },
  versionText: {
    color: Colors.textMuted,
    fontSize: 12,
    opacity: 0.5,
  },
});

export default SplashScreen;
