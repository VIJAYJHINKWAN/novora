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
            {/* Top Toggle: Sign In / Create Account */}
            <View style={styles.modeToggleContainer}>
              <TouchableOpacity
                style={[styles.modeToggleTab, mode === 'login' && styles.modeToggleTabActive]}
                onPress={() => setMode('login')}
              >
                <Text style={[styles.modeToggleText, mode === 'login' && styles.modeToggleTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeToggleTab, mode === 'register' && styles.modeToggleTabActive]}
                onPress={() => setMode('register')}
              >
                <Text style={[styles.modeToggleText, mode === 'register' && styles.modeToggleTextActive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

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
                  placeholder="Enter your password"
                  iconName="lock-closed-outline"
                  rightIconName={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={{ marginTop: 6 }}
                />

                <PageTurnButton
                  text={isSubmitting ? 'Signing in...' : 'Sign In'}
                  onPress={handleSignIn}
                  disabled={isSubmitting}
                  iconName="log-in-outline"
                  style={{ marginTop: 24 }}
                />
              </View>
            )}

            {/* Bottom Mode Switch Link */}
            <TouchableOpacity
              onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
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
    backgroundColor: Colors.cardBg,
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
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeToggleTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeToggleTabActive: {
    backgroundColor: Colors.primaryAccent,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  modeToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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