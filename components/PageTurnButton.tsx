import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface PageTurnButtonProps {
  text: string;
  onPress: () => void;
  isSecondary?: boolean;
  disabled?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  testID?: string;
}

export const PageTurnButton: React.FC<PageTurnButtonProps> = ({
  text,
  onPress,
  isSecondary = false,
  disabled = false,
  iconName,
  style,
  textStyle,
  testID,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      style={[
        styles.button,
        isSecondary ? styles.secondaryButton : styles.primaryButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {iconName && (
        <Ionicons
          name={iconName}
          size={18}
          color={isSecondary ? Colors.primaryText : '#FFFFFF'}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          isSecondary ? styles.secondaryText : styles.primaryText,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 24, // Pill shape
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primaryAccent,
  },
  secondaryButton: {
    backgroundColor: Colors.cardBg,
  },
  disabledButton: {
    backgroundColor: Colors.border,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: Colors.primaryText,
  },
  disabledText: {
    color: Colors.secondaryText,
  },
});
