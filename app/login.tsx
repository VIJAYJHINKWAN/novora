import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
  Image, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Fonts } from '../constants/theme';
import { PageTurnTextField } from '../components/PageTurnTextField';
import { PageTurnButton } from '../components/PageTurnButton';
import { API_BASE_URL } from '../constants/api';

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (mode === 'register' && !name)) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register';
      const body = mode === 'login' ? { email, password } : { name, email, password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Something went wrong');
      }
      await AsyncStorage.setItem('litverse_auth_token', data.token);

      Alert.alert('Success', mode === 'login' ? 'Logged in successfully!' : 'Account created successfully!');
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(mode === 'login' ? 'Sign in failed' : 'Registration failed', error.message || 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.brandBadge}>
              <Image source={require('../assets/icon.png')} style={styles.brandLogo} resizeMode="contain" />
            </View>
            <Text style={styles.heroTitle}>Welcome to Litverse</Text>
            <Text style={styles.heroSubtitle}>
              {mode === 'login'
                ? 'Sign in to join regional book exchanges and literary salons.'
                : 'Create an account to start swapping books with readers near you.'}
            </Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.formSection}>
              {mode === 'register' && (
                <PageTurnTextField
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  iconName="person-outline"
                  style={{ marginBottom: 10 }}
                />
              )}

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
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                iconName="lock-closed-outline"
                secureTextEntry
                style={{ marginTop: 10 }}
              />

              <PageTurnButton
                text={isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in with Email' : 'Create Account'}
                onPress={handleSubmit}
                style={{ marginTop: 24 }}
              />
            </View>

            <TouchableOpacity
              onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
              style={{ alignItems: 'center', paddingVertical: 8 }}
            >
              <Text style={{ color: Colors.secondaryText, fontSize: 14 }}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <Text style={{ color: Colors.primaryText, fontWeight: '700' }}>
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
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
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 24, justifyContent: 'center', minHeight: '100%' },
  header: { alignItems: 'center', marginBottom: 28 },
  brandBadge: {
    width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.cardBg,
    borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
    marginBottom: 20, overflow: 'hidden',
    shadowColor: Colors.primaryAccent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15,
    shadowRadius: 12, elevation: 4,
  },
  brandLogo: { width: '100%', height: '100%', borderRadius: 20 },
  heroTitle: {
    fontFamily: Fonts.serif, fontSize: 32, fontWeight: 'bold', color: Colors.primaryText,
    textAlign: 'center', letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14, lineHeight: 22, color: Colors.secondaryText, textAlign: 'center',
    marginTop: 8, paddingHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: Colors.cardBg, borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05,
    shadowRadius: 16, elevation: 3,
  },
  formSection: { marginBottom: 12 },
});