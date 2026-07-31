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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import { PageTurnTextField } from '../components/PageTurnTextField';
import { PageTurnButton } from '../components/PageTurnButton';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Branding */}
          <View style={styles.header}>
            <View style={styles.brandBadge}>
              <Image
                source={require('../assets/icon.png')}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.heroTitle}>Welcome to Novora</Text>
            <Text style={styles.heroSubtitle}>
              Sign in to join regional book exchanges and literary salons.
            </Text>
          </View>

          {/* Elevated Auth Card */}
          <View style={styles.cardContainer}>
            {/* Input Fields */}
            <View style={styles.formSection}>
              <PageTurnTextField
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="reader@example.com"
                iconName="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <PageTurnTextField
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 98765 43210"
                iconName="call-outline"
                keyboardType="phone-pad"
                style={{ marginTop: 10 }}
              />

              <PageTurnButton
                text={isSigningIn ? 'Authorizing...' : 'Sign in with Email'}
                onPress={handleSignIn}
                style={{ marginTop: 24 }}
              />
            </View>

            {/* SSO Section */}
            <View style={styles.ssoSection}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.ssoButton}
                onPress={handleSignIn}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="logo-google"
                  size={18}
                  color={Colors.primaryText}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.ssoText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ssoButton}
                onPress={handleSignIn}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="logo-apple"
                  size={18}
                  color={Colors.primaryText}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.ssoText}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandBadge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 14,
    lineHeight: 22,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  formSection: {
    marginBottom: 24,
  },
  ssoSection: {},
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(85, 85, 85, 0.45)',
    letterSpacing: 1.2,
    marginHorizontal: 12,
  },
  ssoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 22,
    height: 48,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  ssoText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
  },
});
