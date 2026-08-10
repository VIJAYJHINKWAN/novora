import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';

const TAB_CONFIG: Record<string, { label: string; activeIcon: keyof typeof Ionicons.glyphMap; inactiveIcon: keyof typeof Ionicons.glyphMap }> = {
  index: { label: 'Home', activeIcon: 'home', inactiveIcon: 'home-outline' },
  discover: { label: 'Discover', activeIcon: 'compass', inactiveIcon: 'compass-outline' },
  library: { label: 'Library', activeIcon: 'library', inactiveIcon: 'library-outline' },
  messages: { label: 'Messages', activeIcon: 'chatbubbles', inactiveIcon: 'chatbubbles-outline' },
  profile: { label: 'Profile', activeIcon: 'person', inactiveIcon: 'person-outline' },
};

function CustomAnimatedFloatingTabBar({ state, descriptors, navigation }: any) {
  const activeIndex = state.index;
  const totalTabs = state.routes.length;

  // Shared value for smooth sliding active pill
  const activeTabPosition = useSharedValue(activeIndex);

  useEffect(() => {
    activeTabPosition.value = withSpring(activeIndex, {
      damping: 18,
      stiffness: 180,
      mass: 0.8,
    });
  }, [activeIndex]);

  // Screen width minus container padding & margins divided by total tabs
  const containerMargin = 16;
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = (screenWidth - containerMargin * 2 - 12) / totalTabs;

  const slidingPillStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: activeTabPosition.value * tabWidth }],
    };
  });

  return (
    <View style={styles.floatingWrapper}>
      <View style={styles.floatingContainer}>
        {/* Animated Sliding Pill Background */}
        <Animated.View style={[styles.slidingPill, { width: tabWidth }, slidingPillStyle]} />

        {/* Tab Buttons */}
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || {
            label: route.name,
            activeIcon: 'square',
            inactiveIcon: 'square-outline',
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              label={config.label}
              activeIcon={config.activeIcon}
              inactiveIcon={config.inactiveIcon}
              isFocused={isFocused}
              onPress={onPress}
              hasBadge={route.name === 'messages'}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({
  label,
  activeIcon,
  inactiveIcon,
  isFocused,
  onPress,
  hasBadge,
}: {
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  isFocused: boolean;
  onPress: () => void;
  hasBadge?: boolean;
}) {
  const scale = useSharedValue(isFocused ? 1.15 : 1.0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 1.0, {
      damping: 15,
      stiffness: 200,
    });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
        <Ionicons
          name={isFocused ? activeIcon : inactiveIcon}
          size={22}
          color={isFocused ? Colors.primaryAccent : 'rgba(85, 85, 85, 0.65)'}
        />
        {hasBadge && <View style={styles.badgeDot} />}
      </Animated.View>
      <Text
        style={[
          styles.tabLabel,
          { color: isFocused ? Colors.primaryAccent : 'rgba(85, 85, 85, 0.65)' },
          isFocused && styles.tabLabelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomAnimatedFloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="library" options={{ title: 'Library' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  floatingContainer: {
    flexDirection: 'row',
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234, 235, 237, 0.9)',

    // Floating Elevation & Glassmorphic Shadows
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  slidingPill: {
    position: 'absolute',
    left: 6,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(193, 140, 93, 0.14)',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.alertAccent,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontWeight: 'bold',
  },
});
