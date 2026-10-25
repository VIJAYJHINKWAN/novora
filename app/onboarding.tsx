import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  Extrapolation,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, Fonts } from '../constants/theme';
import { PageTurnButton } from '../components/PageTurnButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StepData {
  id: number;
  title: string;
  badge: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const STEPS_DATA: StepData[] = [
  {
    id: 1,
    badge: 'COMMUNITY',
    title: 'Discover Readers',
    description:
      'Find readers matching your favorite genres just around the block. View verified reading goals and build real connections.',
    icon: 'people',
  },
  {
    id: 2,
    badge: 'SWAP & BORROW',
    title: 'Exchange Books',
    description:
      'Initiate frictionless swaps or temporary borrowing with secure in-app step-by-step progress tracking.',
    icon: 'swap-horizontal',
  },
  {
    id: 3,
    badge: 'EVENTS',
    title: 'Join Events',
    description:
      'RSVP to private poetry circles, curated author salons, and local indie book festivals. Never read in isolation.',
    icon: 'calendar',
  },
];

interface OnboardingItemProps {
  item: StepData;
  index: number;
  scrollX: SharedValue<number>;
}

const OnboardingItem: React.FC<OnboardingItemProps> = ({ item, index, scrollX }) => {
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
      opacity: interpolate(pulseValue.value, [1, 1.15], [0.35, 0.08]),
    };
  });

  const animatedIconContainerStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];

    const scale = interpolate(scrollX.value, inputRange, [0.65, 1, 0.65], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [40, 0, 40], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ scale }, { translateY }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];

    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [50, 0, 50], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={[styles.slideContainer, { width: SCREEN_WIDTH }]}>
      {/* Hero Icon with Animated Pulse */}
      <View style={styles.iconWrapper}>
        <Animated.View style={[styles.pulseCircle, animatedPulseStyle]} />
        <Animated.View style={[styles.iconCircle, animatedIconContainerStyle]}>
          <Ionicons name={item.icon} size={64} color={Colors.primaryAccent} />
        </Animated.View>
      </View>

      {/* Copy Content */}
      <Animated.View style={[styles.copyContainer, animatedTextStyle]}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

interface DotIndicatorProps {
  index: number;
  scrollX: SharedValue<number>;
}

const DotIndicator: React.FC<DotIndicatorProps> = ({ index, scrollX }) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];

    const width = interpolate(scrollX.value, inputRange, [8, 28, 8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolation.CLAMP);
    const backgroundColor = interpolateColor(
      scrollX.value,
      inputRange,
      [Colors.border, Colors.primaryAccent, Colors.border]
    );

    return {
      width,
      opacity,
      backgroundColor,
    };
  });

  return <Animated.View style={[styles.dash, animatedDotStyle]} />;
};

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<Animated.FlatList<StepData>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < STEPS_DATA.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with Skip */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Animated Swipeable FlatList */}
      <Animated.FlatList
        ref={flatListRef}
        data={STEPS_DATA}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item, index }) => (
          <OnboardingItem item={item} index={index} scrollX={scrollX} />
        )}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomSection}>
        {/* Animated Progress Dots */}
        <View style={styles.dotsRow}>
          {STEPS_DATA.map((_, i) => (
            <DotIndicator key={i} index={i} scrollX={scrollX} />
          ))}
        </View>

        <PageTurnButton
          text={activeIndex === STEPS_DATA.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={{ width: '80%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  topBar: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconWrapper: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  pulseCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.primaryAccent,
  },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  copyContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  badgeContainer: {
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryAccent,
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    height: 8,
  },
  dash: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
});
