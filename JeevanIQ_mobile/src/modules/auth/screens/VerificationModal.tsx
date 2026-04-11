import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../../utils/types';
import { ScreenNames } from '../../../utils/screenNames';
import Colors from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import D from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
import { OTP_LENGTH, OTP_RESEND_TIMEOUT } from '../../../utils/constants';
import { maskPhone } from '../../../utils/commonFunctions';
import { useAppDispatch, useAppSelector, useInterval } from '../../../utils/hooks';
// import { verifyOtpAction, sendOtpAction } from '../authActions';
import CustomButton from '../../../components/CustomButton';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'VerificationModal'>;
  route: RouteProp<AuthStackParamList, 'VerificationModal'>;
};

const VerificationModal: React.FC<Props> = ({ navigation, route }) => {
  const { phone } = route.params;
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(s => s.auth);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(OTP_RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Countdown timer
  useInterval(
    () => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    },
    canResend ? null : 1000,
  );

  const handleOtpChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-submit when all filled
    if (cleaned && index === OTP_LENGTH - 1) {
      const full = [...newOtp.slice(0, -1), cleaned].join('');
      if (full.length === OTP_LENGTH) handleVerify(full);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code ?? otp.join('');
    if (otpCode.length < OTP_LENGTH) return;
    // const result = await dispatch(verifyOtpAction({ phone, otp: otpCode }));
    // if (verifyOtpAction.fulfilled.match(result)) {
    //   navigation.navigate(ScreenNames.LOCATION_PERMISSION);
    // }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setCanResend(false);
    setCountdown(OTP_RESEND_TIMEOUT);
    inputRefs.current[0]?.focus();
    // await dispatch(sendOtpAction(phone));
  };

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 400);
  }, []);

  const otpComplete = otp.every(d => d !== '');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Back button */}
      <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.backRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>{'←'}</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>✉</Text>
        </View>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          We sent a {OTP_LENGTH}-digit code to{'\n'}
          <Text style={styles.phone}>{maskPhone(phone)}</Text>
        </Text>
      </Animated.View>

      {/* OTP Inputs */}
      <Animated.View entering={FadeInDown.delay(280).duration(500)} style={styles.otpRow}>
        {Array(OTP_LENGTH)
          .fill(0)
          .map((_, i) => (
            <TextInput
              key={i}
              ref={ref => (inputRefs.current[i] = ref)}
              style={[
                styles.otpInput,
                otp[i] ? styles.otpInputFilled : null,
                error && styles.otpInputError,
              ]}
              value={otp[i]}
              onChangeText={text => handleOtpChange(text, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectionColor={Colors.primary}
              caretHidden
            />
          ))}
      </Animated.View>

      {/* Error */}
      {error ? (
        <Animated.Text entering={FadeInDown.duration(300)} style={styles.errorText}>
          {error}
        </Animated.Text>
      ) : null}

      {/* Verify Button */}
      <Animated.View entering={FadeInDown.delay(380).duration(500)} style={styles.buttonWrapper}>
        <CustomButton
          title={Strings.verifyOtp}
          onPress={() => handleVerify()}
          loading={isLoading}
          disabled={!otpComplete}
        />
      </Animated.View>

      {/* Resend */}
      <Animated.View entering={FadeInDown.delay(450).duration(500)} style={styles.resendRow}>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendActive}>{Strings.resendOtp}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.resendTimer}>{Strings.resendIn(countdown)}</Text>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: D.spacing.base,
  },
  backRow: {
    paddingTop: D.STATUSBAR_HEIGHT + D.spacing.base,
    marginBottom: D.spacing.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backArrow: {
    color: Colors.primary,
    fontSize: 20,
    fontFamily: Fonts.Bold,
  },
  backText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.Medium,
    fontSize: D.fontSize.base,
  },
  header: {
    alignItems: 'center',
    marginBottom: D.verticalScale(40),
    marginTop: D.verticalScale(20),
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xxl,
    color: Colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  phone: {
    color: Colors.primary,
    fontFamily: Fonts.SemiBold,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: D.spacing.sm,
    marginBottom: D.spacing.base,
  },
  otpInput: {
    width: D.scale(46),
    height: D.verticalScale(56),
    borderRadius: D.radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
    color: Colors.textPrimary,
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xl,
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
    color: Colors.primary,
  },
  otpInputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.sm,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: D.spacing.base,
  },
  buttonWrapper: {
    marginTop: D.spacing.base,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: D.spacing.xl,
  },
  resendActive: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.base,
    color: Colors.primary,
  },
  resendTimer: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.base,
    color: Colors.textMuted,
  },
});

export default VerificationModal;