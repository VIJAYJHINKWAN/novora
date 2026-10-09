import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Pressable,
  KeyboardTypeOptions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

export interface PageTurnTextFieldProps {
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
  autoCorrect?: boolean;
  autoComplete?: any;
  textContentType?: any;
  style?: ViewStyle;
  testID?: string;
}

export const PageTurnTextField: React.FC<PageTurnTextFieldProps> = React.memo(({
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
  autoCorrect = false,
  autoComplete,
  textContentType,
  style,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleContainerPress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, isFocused && styles.labelFocused]}>{label}</Text>}
      <Pressable
        onPress={handleContainerPress}
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
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(85, 85, 85, 0.4)"
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          spellCheck={false}
          autoComplete={autoComplete}
          textContentType={textContentType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          testID={testID}
          style={[
            styles.input,
            multiline && {
              height: numberOfLines * 24,
              textAlignVertical: 'top',
              paddingTop: Platform.OS === 'android' ? 6 : 8,
            },
          ]}
        />
        {rightIconName && (
          <TouchableOpacity
            onPress={onRightIconPress}
            activeOpacity={0.7}
            style={styles.rightIconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={rightIconName}
              size={20}
              color={Colors.secondaryText}
            />
          </TouchableOpacity>
        )}
      </Pressable>
    </View>
  );
});

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
    minHeight: 52,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  inputWrapperNormal: {
    borderColor: Colors.border,
  },
  inputWrapperFocused: {
    borderColor: Colors.primaryAccent,
  },
  multilineWrapper: {
    minHeight: 84,
    alignItems: 'flex-start',
    paddingVertical: 10,
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
    paddingVertical: Platform.OS === 'android' ? 0 : 8,
    paddingHorizontal: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
