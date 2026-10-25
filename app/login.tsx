import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import { PageTurnTextField } from '../components/PageTurnTextField';
import { PageTurnButton } from '../components/PageTurnButton';
import { ForgotPasswordModal } from '../components/modals/ForgotPasswordModal';
import { resilientFetch } from '../constants/api';
import { useApp } from '../context/AppContext';

// Dynamic Password Criteria Checklist Item
interface PasswordCriteriaRowProps {
  met: boolean;
  text: string;
}

const PasswordCriteriaRow: React.FC<PasswordCriteriaRowProps> = React.memo(({ met, text }) => (
  <View style={styles.criteriaRow}>
    <Ionicons
      name={met ? 'checkmark-circle' : 'ellipse-outline'}
      size={15}
      color={met ? Colors.successAccent : Colors.secondaryText}
      style={{ marginRight: 6 }}
    />
    <Text style={[styles.criteriaText, met && styles.criteriaTextMet]}>{text}</Text>
  </View>
));

export default function LoginScreen() {
  const router = useRouter();
  const { refreshAppData } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password & Contextual Auth State
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<{
    type: 'incorrect_password' | 'not_registered' | 'error';
    message: string;
  } | null>(null);

  // Email format validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Password Policy Checks (Combination of letters, numbers, symbols, 8+ chars)
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber && hasSymbol;

  // Sign In Handler
  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    setAuthFeedback(null);

    if (!trimmedEmail) {
      Alert.alert('Required', 'Please enter your email address.');
      return;
    }
    if (!isEmailValid) {
      Alert.alert('Invalid Email', 'Please enter a valid email address (e.g. reader@example.com).');
      return;
    }
    if (!password) {
      Alert.alert('Required', 'Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resilientFetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: trimmedEmail,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'success') {
        // Case 1: Account not registered in database
        if (data.code === 'NOT_REGISTERED' || data.message?.toLowerCase().includes('not registered')) {
          setAuthFeedback({
            type: 'not_registered',
            message: 'You are not registered yet. Please create an account to get started.',
          });
          Alert.alert(
            'Not Registered',
            'You are not registered yet. Would you like to create an account now?',
            [
              {
                text: 'Create Account',
                onPress: () => {
                  setAuthFeedback(null);
                  setMode('register');
                },
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
          return;
        }

        // Case 2: User exists, but incorrect password
        if (data.code === 'INCORRECT_PASSWORD' || data.message?.toLowerCase().includes('incorrect')) {
          setAuthFeedback({
            type: 'incorrect_password',
            message: 'The password entered is incorrect.',
          });
          Alert.alert(
            'Incorrect Password',
            'The password entered is incorrect. Would you like to reset your password?',
            [
              {
                text: 'Forgot Password?',
                onPress: () => setShowForgotPasswordModal(true),
              },
              { text: 'Try Again', style: 'cancel' },
            ]
          );
          return;
        }

        throw new Error(data.message || 'Invalid email or password.');
      }

      if (data.token) {
        await AsyncStorage.setItem('litverse_auth_token', data.token);
      }

      // Refresh app & profile context with the authenticated session
      await refreshAppData();

      router.replace('/(tabs)/profile');
    } catch (error: any) {
      Alert.alert(
        'Sign In Failed',
        error.message || 'Could not connect to the backend server. Please verify your connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign Up Handler (Enforces strict email format & combination password policy)
  const handleSignUp = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !isEmailValid) {
      Alert.alert('Invalid Email', 'Please enter a valid email address (e.g. reader@example.com).');
      return;
    }
    if (!isPasswordValid) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters and include a combination of letters, numbers, and special symbols (!@#$%^&*).'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resilientFetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: password,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Could not complete registration.');
      }

      if (data.token) {
        await AsyncStorage.setItem('litverse_auth_token', data.token);
      }

      // Refresh app & profile context with the newly created account
      await refreshAppData();

      Alert.alert('Welcome to Novora!', 'Your account has been created successfully.');
      router.replace('/(tabs)/profile');
    } catch (error: any) {
      Alert.alert(
        'Sign Up Failed',
        error.message || 'Could not connect to the backend server. Please verify your connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.contentWrapper}>
            {/* Header Brand Badge & Hero */}
            <View style={styles.header}>
              <View style={styles.brandBadge}>
                <Image source={require('../assets/icon.png')} style={styles.brandLogo} resizeMode="contain" />
              </View>
              <Text style={styles.heroTitle}>Novora</Text>
              <Text style={styles.heroSubtitle}>
                {mode === 'login'
                  ? 'Sign in to join regional book exchanges and literary salons.'
                  : 'Create your reader account to connect with fellow book lovers.'}
              </Text>
            </View>

            {/* Elevated Auth Card */}
            <View style={styles.cardContainer}>
              {mode === 'register' && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setAuthFeedback(null);
                    setMode('login');
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={18} color={Colors.primaryAccent} />
                  <Text style={styles.backButtonText}>Back to Sign In</Text>
                </TouchableOpacity>
              )}

              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {mode === 'login'
                    ? 'Enter your credentials to access your account'
                    : 'Join Novora to connect with fellow book lovers'}
                </Text>
              </View>

              {/* Contextual Auth Notification Banner */}
              {authFeedback && (
                <View
                  style={[
                    styles.authBanner,
                    authFeedback.type === 'not_registered'
                      ? styles.authBannerNotRegistered
                    : styles.authBannerIncorrect,
                ]}
              >
                <Ionicons
                  name={authFeedback.type === 'not_registered' ? 'person-add-outline' : 'key-outline'}
                  size={20}
                  color={authFeedback.type === 'not_registered' ? '#2563EB' : '#C2410C'}
                  style={{ marginTop: 2, marginRight: 10 }}
                />
                <View style={styles.authBannerBody}>
                  <Text
                    style={[
                      styles.authBannerTitle,
                      authFeedback.type === 'not_registered'
                        ? styles.authBannerTitleNotRegistered
                        : styles.authBannerTitleIncorrect,
                    ]}
                  >
                    {authFeedback.type === 'not_registered' ? 'Not Registered Yet' : 'Incorrect Password'}
                  </Text>
                  <Text style={styles.authBannerText}>{authFeedback.message}</Text>
                  {authFeedback.type === 'not_registered' ? (
                    <TouchableOpacity
                      style={styles.authBannerActionBtn}
                      onPress={() => {
                        setAuthFeedback(null);
                        setMode('register');
                      }}
                    >
                      <Text style={styles.authBannerActionTextBlue}>Create an account now →</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.authBannerActionBtn}
                      onPress={() => setShowForgotPasswordModal(true)}
                    >
                      <Text style={styles.authBannerActionTextOrange}>Forgot Password / Reset Now →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* FORM BODY */}
            {mode === 'register' ? (
              /* --- REGISTER FLOW --- */
              <View style={styles.formSection}>
                <PageTurnTextField
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Jane Austen"
                  iconName="person-outline"
                />

                <View style={styles.fieldContainer}>
                  <PageTurnTextField
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="reader@example.com"
                    iconName="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {email.length > 0 && !isEmailValid && (
                    <Text style={styles.fieldErrorText}>Please enter a valid email format.</Text>
                  )}
                </View>

                <PageTurnTextField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a strong password"
                  iconName="lock-closed-outline"
                  rightIconName={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={{ marginTop: 4 }}
                />

                {/* Password Instructions & Dynamic Criteria Checklist */}
                <View style={styles.passwordRulesBox}>
                  <Text style={styles.passwordRulesTitle}>Password requirements:</Text>
                  <PasswordCriteriaRow met={hasMinLength} text="At least 8 characters" />
                  <PasswordCriteriaRow met={hasLetter} text="Contains letters (A-Z, a-z)" />
                  <PasswordCriteriaRow met={hasNumber} text="Contains numbers (0-9)" />
                  <PasswordCriteriaRow met={hasSymbol} text="Contains special symbols (!@#$%^&*...)" />
                </View>

                <PageTurnButton
                  text={isSubmitting ? 'Creating Account...' : 'Create Account'}
                  onPress={handleSignUp}
                  disabled={isSubmitting}
                  iconName="person-add-outline"
                  style={{ marginTop: 20 }}
                />
              </View>
            ) : (
              /* --- LOGIN FLOW --- */
              <View style={styles.formSection}>
                <View style={styles.fieldContainer}>
                  <PageTurnTextField
                    label="Email Address"
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (authFeedback) setAuthFeedback(null);
                    }}
                    placeholder="reader@example.com"
                    iconName="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {email.length > 0 && !isEmailValid && (
                    <Text style={styles.fieldErrorText}>Please enter a valid email format.</Text>
                  )}
                </View>

                <PageTurnTextField
                  label="Password"
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (authFeedback) setAuthFeedback(null);
                  }}
                  placeholder="Enter your password"
                  iconName="lock-closed-outline"
                  rightIconName={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={{ marginTop: 6 }}
                />

                {/* Forgot Password Action Link */}
                <View style={styles.forgotPasswordRow}>
                  <TouchableOpacity
                    onPress={() => setShowForgotPasswordModal(true)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                <PageTurnButton
                  text={isSubmitting ? 'Signing in...' : 'Sign In'}
                  onPress={handleSignIn}
                  disabled={isSubmitting}
                  iconName="log-in-outline"
                  style={{ marginTop: 18 }}
                />
              </View>
            )}

            {/* Bottom Mode Switch Link */}
            <TouchableOpacity
              onPress={() => {
                setAuthFeedback(null);
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              style={styles.switchModeRow}
            >
              <Text style={styles.switchModeText}>
                {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
                <Text style={styles.switchModeAction}>
                  {mode === 'login' ? 'Create an account' : 'Sign in'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Reset Modal */}
      <ForgotPasswordModal
        visible={showForgotPasswordModal}
        initialEmail={email}
        onDismiss={() => setShowForgotPasswordModal(false)}
        onSuccess={(newPassword, registeredEmail) => {
          setShowForgotPasswordModal(false);
          setEmail(registeredEmail);
          setPassword(newPassword);
          setAuthFeedback(null);
          Alert.alert(
            'Password Updated',
            'Your password has been reset successfully! You can now sign in with your new password.'
          );
        }}
        onSwitchToRegister={(registeredEmail) => {
          setShowForgotPasswordModal(false);
          setEmail(registeredEmail);
          setMode('register');
          setAuthFeedback(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#F7F8FA' : Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 48 : 20,
    paddingBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  brandBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  brandLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  heroTitle: {
    fontFamily: Fonts.serif,
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primaryText,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.04)',
        }
      : {}),
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.secondaryText,
    lineHeight: 18,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryAccent,
    marginLeft: 6,
  },
  formSection: {
    marginBottom: 6,
  },
  fieldContainer: {
    marginBottom: 2,
  },
  fieldErrorText: {
    fontSize: 11,
    color: Colors.alertAccent,
    marginTop: -4,
    marginBottom: 6,
    marginLeft: 4,
  },
  passwordRulesBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordRulesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 6,
  },
  criteriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2.5,
  },
  criteriaText: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  criteriaTextMet: {
    color: Colors.successAccent,
    fontWeight: '600',
  },
  forgotPasswordRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
    paddingRight: 2,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: Colors.primaryAccent,
    fontWeight: '600',
  },
  authBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  authBannerIncorrect: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
  },
  authBannerNotRegistered: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  authBannerBody: {
    flex: 1,
  },
  authBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  authBannerTitleIncorrect: {
    color: '#9A3412',
  },
  authBannerTitleNotRegistered: {
    color: '#1E40AF',
  },
  authBannerText: {
    fontSize: 13,
    color: Colors.primaryText,
    lineHeight: 18,
  },
  authBannerActionBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  authBannerActionTextOrange: {
    fontSize: 13,
    color: '#C2410C',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  authBannerActionTextBlue: {
    fontSize: 13,
    color: '#1D4ED8',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  switchModeRow: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  switchModeText: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  switchModeAction: {
    color: Colors.primaryAccent,
    fontWeight: '700',
  },
});