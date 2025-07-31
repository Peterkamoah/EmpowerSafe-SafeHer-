import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  style,
}: PrimaryButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[size],
    variant === 'secondary' && styles.secondary,
    variant === 'danger' && styles.danger,
    variant === 'primary' && styles.primary,
    (disabled || loading) && styles.disabled,
    style,
  ].filter(Boolean);

  const textStyles = [
    styles.text,
    variant === 'secondary' && styles.secondaryText,
    variant !== 'secondary' && styles.primaryText,
    (disabled || loading) && styles.disabledText,
  ].filter(Boolean);

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <ThemedText style={textStyles}>{title}</ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sm: {
    height: Layout.buttonHeight.sm,
    paddingHorizontal: Layout.spacing.md,
  },
  md: {
    height: Layout.buttonHeight.md,
    paddingHorizontal: Layout.spacing.lg,
  },
  lg: {
    height: Layout.buttonHeight.lg,
    paddingHorizontal: Layout.spacing.xl,
  },
  primary: {
    backgroundColor: SafeHerColors.primary,
  },
  secondary: {
    backgroundColor: SafeHerColors.backgroundSecondary,
    borderWidth: 1,
    borderColor: SafeHerColors.primary,
  },
  danger: {
    backgroundColor: SafeHerColors.danger,
  },
  disabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: SafeHerColors.primary,
  },
  disabledText: {
    color: '#9CA3AF',
  },
});