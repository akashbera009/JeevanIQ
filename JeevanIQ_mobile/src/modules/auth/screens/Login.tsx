import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { loginAction } from '../authActions';
import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';
import Colors from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import D from '../../../utils/dimensions';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      dispatch(loginAction({ email, password }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to JeevanIQ</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
              error={error && error.toLowerCase().includes('email') ? error : undefined}
            />

            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock"
              containerStyle={styles.inputContainer}
              error={error && error.toLowerCase().includes('password') ? error : undefined}
            />

            {error && !error.toLowerCase().includes('email') && !error.toLowerCase().includes('password') && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: D.spacing.lg,
    paddingTop: D.SCREEN_HEIGHT * 0.1,
  },
  header: {
    marginBottom: D.spacing.xxl,
  },
  title: {
    fontSize: D.fontSize.xxl,
    fontFamily: Fonts.Bold,
    color: Colors.textPrimary,
    marginBottom: D.spacing.xs,
  },
  subtitle: {
    fontSize: D.fontSize.md,
    fontFamily: Fonts.Medium,
    color: Colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginTop: D.spacing.md,
  },
  loginButton: {
    marginTop: D.spacing.xxl,
  },
  errorText: {
    color: Colors.error,
    fontSize: D.fontSize.sm,
    fontFamily: Fonts.Medium,
    marginTop: D.spacing.sm,
    textAlign: 'center',
  },
});

export default Login;
