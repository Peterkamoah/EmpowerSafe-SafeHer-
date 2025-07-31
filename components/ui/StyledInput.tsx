import React from 'react';
import { TextInput, StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface StyledInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function StyledInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  disabled = false,
  style,
}: StyledInputProps) {
  const inputStyles = [
    styles.input,
    multiline && styles.multilineInput,
    error && styles.inputError,
    disabled && styles.inputDisabled,
  ].filter(Boolean);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <ThemedText style={styles.label}>{label}</ThemedText>
      )}
      <TextInput
        style={inputStyles}
        placeholder={placeholder}
        placeholderTextColor={SafeHerColors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.md,
  },
  label: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: SafeHerColors.textPrimary,
    marginBottom: Layout.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    fontSize: Layout.fontSize.md,
    color: SafeHerColors.textPrimary,
    backgroundColor: SafeHerColors.backgroundPrimary,
    minHeight: Layout.buttonHeight.md,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: Layout.spacing.md,
  },
  inputError: {
    borderColor: SafeHerColors.danger,
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: Layout.fontSize.xs,
    color: SafeHerColors.danger,
    marginTop: Layout.spacing.xs,
  },
});