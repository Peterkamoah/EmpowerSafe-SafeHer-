import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyledInput } from '@/components/ui/StyledInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Implement actual login logic
    Alert.alert('Login Attempt', `Email: ${email}, Password: ${password}`);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign in to continue to SafeHer
        </ThemedText>
      </View>
      <View style={styles.form}>
        <StyledInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <StyledInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
        <PrimaryButton title="Login" onPress={handleLogin} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.md,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  title: {
    color: SafeHerColors.primary,
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    color: SafeHerColors.textSecondary,
    fontSize: Layout.fontSize.md,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
});