import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { PageTurnTextField } from '../PageTurnTextField';
import { PageTurnButton } from '../PageTurnButton';
import { resilientFetch } from '../../constants/api';

interface ForgotPasswordModalProps {
  visible: boolean;
  initialEmail?: string;
  onDismiss: () => void;
  onSuccess: (newPassword: string, email: string) => void;
  onSwitchToRegister: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  initialEmail = '',
  onDismiss,
  onSuccess,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'error' | 'success' | null>(null);
  const [isNotRegistered, setIsNotRegistered] = useState(false);

  useEffect(() => {
    if (visible) {
      setEmail(initialEmail);
      setPassword('');
      setConfirmPassword('');
      setStatusMessage(null);
      setStatusType(null);
      setIsNotRegistered(false);
    }
  }, [visible, initialEmail]);

  // Email format validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Password Policy Checks (8+ chars, letters, numbers, symbols)
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber && hasSymbol;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    setStatusMessage(null);
    setStatusType(null);
    setIsNotRegistered(false);

    if (!trimmedEmail) {
      setStatusMessage('Please enter your email address.');
      setStatusType('error');
      return;
    }

    if (!isEmailValid) {
      setStatusMessage('Please enter a valid email address (e.g. reader@example.com).');
      setStatusType('error');
      return;
    }

    if (!isPasswordValid) {
      setStatusMessage('Please meet all password requirements listed below.');
      setStatusType('error');
      return;
    }

    if (!passwordsMatch) {
      setStatusMessage('Passwords do not match. Please verify your entries.');
      setStatusType('error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resilientFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: trimmedEmail,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'success') {
        if (data.code === 'NOT_REGISTERED' || data.message?.toLowerCase().includes('not registered')) {
          setIsNotRegistered(true);
          setStatusMessage('You are not registered yet. Please create an account to get started.');
          setStatusType('error');
          return;
        }

        throw new Error(data.message || 'Could not reset password. Please try again.');
      }

      setStatusMessage('Password reset successfully! You can now sign in.');
      setStatusType('success');

      setTimeout(() => {
        onSuccess(password, trimmedEmail);
      }, 900);
    } catch (err: any) {
      setStatusMessage(err.message || 'Could not connect to the backend server.');
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToRegister = () => {
    const trimmedEmail = email.trim();
    onDismiss();
    onSwitchToRegister(trimmedEmail);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onDismiss}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onDismiss}
        />
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
            <Ionicons name="close" size={24} color={Colors.primaryText} />
          </TouchableOpacity>

          <View style={styles.headerIconContainer}>
            <View style={styles.headerIconBadge}>
              <Ionicons name="key-outline" size={24} color={Colors.primaryAccent} />
            </View>
            <Text style={styles.heading}>Reset Password</Text>
            <Text style={styles.subheading}>
              Enter your registered email and choose a new secure password.
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Status notification banner */}
            {statusMessage && (
              <View
                style={[
                  styles.statusBanner,
                  statusType === 'error' ? styles.statusError : styles.statusSuccess,
                ]}
              >
                <Ionicons
                  name={statusType === 'error' ? 'alert-circle' : 'checkmark-circle'}
                  size={18}
                  color={statusType === 'error' ? '#C2410C' : '#15803D'}
                  style={{ marginRight: 8, marginTop: 1 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.statusBannerText,
                      statusType === 'error' ? styles.statusErrorText : styles.statusSuccessText,
                    ]}
                  >
                    {statusMessage}
                  </Text>
                  {isNotRegistered && (
                    <TouchableOpacity
                      onPress={handleGoToRegister}
                      style={styles.createAccountLink}
                    >
                      <Text style={styles.createAccountLinkText}>
                        Create an account now →
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            <PageTurnTextField
              label="Registered Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setStatusMessage(null);
                setIsNotRegistered(false);
              }}
              placeholder="reader@example.com"
              iconName="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {email.length > 0 && !isEmailValid && (
              <Text style={styles.fieldErrorText}>Please enter a valid email address.</Text>
            )}

            <PageTurnTextField
              label="New Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setStatusMessage(null);
              }}
              placeholder="Enter new password"
              iconName="lock-closed-outline"
              rightIconName={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={{ marginTop: 10 }}
            />

            <PageTurnTextField
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setStatusMessage(null);
              }}
              placeholder="Repeat new password"
              iconName="shield-checkmark-outline"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={{ marginTop: 10 }}
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <Text style={styles.fieldErrorText}>Passwords do not match.</Text>
            )}

            {/* Password Policy Criteria Checklist */}
            <View style={styles.passwordRulesBox}>
              <Text style={styles.passwordRulesTitle}>Password requirements:</Text>
              <CriteriaRow met={hasMinLength} text="At least 8 characters" />
              <CriteriaRow met={hasLetter} text="Contains letters (A-Z, a-z)" />
              <CriteriaRow met={hasNumber} text="Contains numbers (0-9)" />
              <CriteriaRow met={hasSymbol} text="Contains special symbols (!@#$%^&*...)" />
            </View>

            <PageTurnButton
              text={isSubmitting ? 'Updating Password...' : 'Reset Password'}
              onPress={handleSubmit}
              disabled={isSubmitting || !isPasswordValid || !passwordsMatch || !isEmailValid}
              iconName="checkmark-circle-outline"
              style={{ marginTop: 20 }}
            />

            <TouchableOpacity style={styles.cancelBtn} onPress={onDismiss}>
              <Text style={styles.cancelBtnText}>Back to Sign In</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const CriteriaRow = ({ met, text }: { met: boolean; text: string }) => (
  <View style={styles.criteriaRow}>
    <Ionicons
      name={met ? 'checkmark-circle' : 'ellipse-outline'}
      size={15}
      color={met ? '#2E7D32' : Colors.secondaryText}
      style={{ marginRight: 6 }}
    />
    <Text style={[styles.criteriaText, met && styles.criteriaTextMet]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: Colors.secondaryBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  closeBtn: {
    position: 'absolute',
    right: 18,
    top: 16,
    zIndex: 10,
    padding: 6,
  },
  headerIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 6,
  },
  headerIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primaryText,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 13,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  fieldErrorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
    marginLeft: 4,
  },
  passwordRulesBox: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  passwordRulesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 8,
  },
  criteriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  criteriaText: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  criteriaTextMet: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  statusError: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
  },
  statusSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  statusBannerText: {
    fontSize: 13,
    lineHeight: 18,
  },
  statusErrorText: {
    color: '#C2410C',
  },
  statusSuccessText: {
    color: '#15803D',
    fontWeight: '500',
  },
  createAccountLink: {
    marginTop: 6,
  },
  createAccountLinkText: {
    fontSize: 13,
    color: Colors.primaryAccent,
    fontWeight: 'bold',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  cancelBtnText: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
});
