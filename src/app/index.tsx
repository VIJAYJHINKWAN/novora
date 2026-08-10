import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../constants/theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        {/* Novora Brand App Icon */}
        <View style={styles.logoBadge}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Novora</Text>
        <Text style={styles.tagline}>Discover stories. Connect with readers</Text>

        <ActivityIndicator color={Colors.primaryAccent} size="small" style={{ marginTop: 48 }} />
      </View>

      <Text style={styles.footerTagline}>EST. 2026</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 24,
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
    shadowRadius: 10,
    elevation: 4,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primaryText,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 14,
    color: Colors.secondaryText,
    letterSpacing: 0.8,
    marginTop: 8,
    textAlign: 'center',
  },
  footerTagline: {
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(85, 85, 85, 0.6)',
    fontWeight: '600',
  },
});
