import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleProp,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface SlideIndicatorScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  scrollViewStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  arrowContainerStyle?: StyleProp<ViewStyle>;
  step?: number;
  hideArrow?: boolean;
}

export const SlideIndicatorScrollView: React.FC<SlideIndicatorScrollViewProps> = ({
  children,
  style,
  containerStyle,
  scrollViewStyle,
  contentContainerStyle,
  arrowContainerStyle,
  step = 160,
  hideArrow = false,
  ...restProps
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  // Show arrow if content overflows container width
  const hasOverflow = layoutWidth > 0 && contentWidth > 0 && contentWidth > layoutWidth + 6;
  const isAtEnd = layoutWidth > 0 && contentWidth > 0 && scrollX >= contentWidth - layoutWidth - 10;
  const showArrow = !hideArrow && hasOverflow;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setScrollX(x);
    restProps.onScroll?.(e);
  };

  const handleArrowPress = () => {
    if (!scrollRef.current) return;
    if (isAtEnd) {
      // At the end: scroll back to start
      scrollRef.current.scrollTo({ x: 0, animated: true });
    } else {
      // Scroll forward by step
      const maxScroll = Math.max(0, contentWidth - layoutWidth);
      const target = Math.min(maxScroll, scrollX + step);
      scrollRef.current.scrollTo({ x: target, animated: true });
    }
  };

  return (
    <View style={[styles.outerRow, containerStyle, style]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
        onContentSizeChange={(w) => setContentWidth(w)}
        contentContainerStyle={contentContainerStyle}
        style={[styles.scrollView, scrollViewStyle]}
        {...restProps}
      >
        {children}
      </ScrollView>

      {/* Seamless Inline Slide Arrow Indicator (placed outside ScrollView so it NEVER overlaps text) */}
      {showArrow && (
        <View style={[styles.arrowSlot, arrowContainerStyle]}>
          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={handleArrowPress}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            accessibilityLabel={isAtEnd ? 'Slide back to start' : 'Slide to see more options'}
            accessibilityRole="button"
          >
            <Ionicons
              name={isAtEnd ? 'chevron-back' : 'chevron-forward'}
              size={13}
              color={Colors.primaryAccent}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  arrowSlot: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 8,
  },
  arrowBtn: {
    width: 20,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(193, 140, 93, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(193, 140, 93, 0.28)',
  },
});
