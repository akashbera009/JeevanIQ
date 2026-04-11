import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
// import Geolocation from '@react-native-community/geolocation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../utils/types';
import Colors from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import D from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
// import { setOnboarded } from '../../../utils/mmkvStorage';
import CustomButton from '../../../components/CustomButton';
import { useEffect } from 'react';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'LocationPermission'>;
};

const LocationPermissionScreen: React.FC<Props> = ({ navigation }) => {
  const pulseScale = useSharedValue(1);
  const ring1Opacity = useSharedValue(0.6);
  const ring2Opacity = useSharedValue(0.3);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    opacity: ring1Opacity.value,
    transform: [{ scale: pulseScale.value * 1.3 }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: ring2Opacity.value,
    transform: [{ scale: pulseScale.value * 1.7 }],
  }));

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
    ring1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 900 }),
        withTiming(0.6, { duration: 900 }),
      ),
      -1,
    );
    ring2Opacity.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: 900 }),
        withTiming(0.3, { duration: 900 }),
      ),
      -1,
    );
  }, []);

  const finishOnboarding = () => {
    // setOnboarded();
    // RootNavigator will pick up isAuthenticated and route to BottomTab
  };

  const requestLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Geolocation.getCurrentPosition(
        //   () => finishOnboarding(),
        //   () => finishOnboarding(),
        //   { enableHighAccuracy: true, timeout: 10000 },
        // );
        return;
      }
    } else {
      // Geolocation.requestAuthorization();
    }
    finishOnboarding();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Animated location icon */}
      <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.iconArea}>
        <Animated.View style={[styles.ring2, ring2Style]} />
        <Animated.View style={[styles.ring1, ring1Style]} />
        <Animated.View style={[styles.iconCircle, pulseStyle]}>
          <Text style={styles.pinEmoji}>📍</Text>
        </Animated.View>
      </Animated.View>

      {/* Text content */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.textContainer}>
        <Text style={styles.title}>{Strings.locationPermissionTitle}</Text>
        <View style={styles.accentLine} />
        <Text style={styles.description}>{Strings.locationPermissionDesc}</Text>

        {/* Feature list */}
        {[
          'Find nearest hospital facility',
          'Auto-assign to closest department',
          'Emergency response routing',
        ].map((feature, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Actions */}
      <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.actions}>
        <CustomButton title={Strings.allowLocation} onPress={requestLocation} />
        <CustomButton
          title={Strings.skipForNow}
          onPress={finishOnboarding}
          variant="ghost"
          style={styles.skipButton}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: D.spacing.base,
    justifyContent: 'center',
  },
  iconArea: {
    alignItems: 'center',
    justifyContent: 'center',
    height: D.verticalScale(180),
    marginBottom: D.verticalScale(32),
  },
  ring2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primaryGlow,
  },
  ring1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryMuted,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinEmoji: {
    fontSize: 36,
  },
  textContainer: {
    marginBottom: D.verticalScale(40),
  },
  title: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.display,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  accentLine: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginBottom: 16,
  },
  description: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: D.spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: D.spacing.sm,
    gap: D.spacing.sm,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  featureText: {
    fontFamily: Fonts.Medium,
    fontSize: D.fontSize.base,
    color: Colors.textSecondary,
  },
  actions: {
    gap: D.spacing.sm,
  },
  skipButton: {
    marginTop: 4,
  },
});

export default LocationPermissionScreen;