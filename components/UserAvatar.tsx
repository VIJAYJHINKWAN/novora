import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/theme';

interface UserAvatarProps {
  name: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  size = 40,
  backgroundColor = 'rgba(193, 140, 93, 0.15)',
  textColor = Colors.primaryAccent,
  style,
}) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const dynamicStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
  };

  return (
    <View style={[styles.avatar, dynamicStyle, style]}>
      <Text style={[styles.text, { fontSize: size * 0.35, color: textColor }]}>
        {initials || 'U'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
