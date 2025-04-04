import React from 'react';
import { Text as RNText, TextInput as RNTextInput, TextProps, TextInputProps, StyleSheet } from 'react-native';
import { colors } from '../config/colors';

export function Text(props: TextProps) {
  const { style, ...otherProps } = props;
  return (
    <RNText
      style={[styles.text, style]}
      {...otherProps}
    />
  );
}

export function TextInput(props: TextInputProps) {
  const { style, ...otherProps } = props;
  return (
    <RNTextInput
      style={[styles.input, style]}
      placeholderTextColor={colors.text + '80'}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.text,
    fontSize: 16,
  },
  input: {
    color: colors.text,
    fontSize: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
}); 