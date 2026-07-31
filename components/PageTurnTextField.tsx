import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TouchableOpacity, KeyboardTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface PageTurnTextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
  testID?: string;
}

export const PageTurnTextField: React.FC<PageTurnTextFieldProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  iconName,
  rightIconName,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, isFocused && styles.labelFocused]}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          multiline && styles.multilineWrapper,
          isFocused ? styles.inputWrapperFocused : styles.inputWrapperNormal,
        ]}
      >
        {iconName && (
          <View style={[styles.iconContainer, isFocused && styles.iconContainerFocused]}>
            <Ionicons
              name={iconName}
              size={18}
              color={isFocused ? Colors.primaryAccent : Colors.secondaryText}
            />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(85, 85, 85, 0.4)"
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          testID={testID}
          style={[
            styles.input,
            multiline && { height: numberOfLines * 24, textAlignVertical: 'top' },
          ]}
        />
        {rightIconName && (
          <TouchableOpacity onPress={onRightIconPress} activeOpacity={0.7} style={styles.rightIconBtn}>
            <Ionicons
              name={rightIconName}
              size={20}
              color={Colors.secondaryText}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondaryText,
    marginBottom: 6,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  labelFocused: {
    color: Colors.primaryAccent,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 52,
    borderWidth: 1.5,
  },
  inputWrapperNormal: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.border,
  },
  inputWrapperFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.primaryAccent,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  multilineWrapper: {
    height: 'auto',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconContainerFocused: {
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
  },
  rightIconBtn: {
    padding: 6,
    marginLeft: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.primaryText,
    padding: 0,
    height: '100%',
  },
});
