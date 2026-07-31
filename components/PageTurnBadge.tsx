import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/theme';

interface PageTurnBadgeProps {
  text: string;
  isAccent?: boolean;
  isSuccess?: boolean;
  isOutline?: boolean;
  style?: ViewStyle;
}

export const PageTurnBadge: React.FC<PageTurnBadgeProps> = ({
  text,
  isAccent = false,
  isSuccess = false,
  isOutline = false,
  style,
}) => {
  let containerBg = Colors.cardBg;
  let contentColor = Colors.primaryText;

  if (isOutline) {
    containerBg = 'transparent';
  } else if (isAccent) {
    containerBg = 'rgba(193, 140, 93, 0.12)';
    contentColor = Colors.primaryAccent;
  } else if (isSuccess) {
    containerBg = 'rgba(112, 138, 129, 0.12)';
    contentColor = Colors.successAccent;
  }

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: containerBg },
        isOutline && styles.outline,
        style,
      ]}
    >
      <Text style={[styles.badgeText, { color: contentColor }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
