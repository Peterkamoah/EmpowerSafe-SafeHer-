import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { router } from 'expo-router';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

export default function WelcomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Welcome to SafeHer</ThemedText>
        <ThemedText style={styles.subtitle}>Your safety, amplified.</ThemedText>
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton title="Login with Email" onPress={() => router.push('/(auth)/login')} />
        <PrimaryButton title="Sign Up with Email" onPress={() => router.push('/(auth)/signup')} variant="secondary" />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xxl,
  },
  title: {
    color: SafeHerColors.primary,
    marginBottom: Layout.spacing.md,
  },
  subtitle: {
    color: SafeHerColors.textSecondary,
    fontSize: Layout.fontSize.lg,
  },
  buttonContainer: {
    width: '100%',
  },
});