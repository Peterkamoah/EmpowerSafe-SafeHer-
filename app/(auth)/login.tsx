import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StyledInput } from '@/components/ui/StyledInput';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Login</ThemedText>
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
      <PrimaryButton title="Login" onPress={handleLogin} loading={loading} disabled={loading} />
      <PrimaryButton title="Don't have an account? Sign Up" onPress={() => router.replace('/(auth)/signup')} variant="secondary" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Layout.spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
    color: SafeHerColors.primary,
  },
});