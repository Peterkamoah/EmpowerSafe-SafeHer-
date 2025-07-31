import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StyledInput } from '@/components/ui/StyledInput';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'Users', user.uid), {
        email: user.email,
        createdAt: new Date(),
      });
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
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
      <StyledInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm your password"
        secureTextEntry
      />
      <PrimaryButton title="Sign Up" onPress={handleSignup} loading={loading} disabled={loading} />
      <PrimaryButton title="Already have an account? Login" onPress={() => router.replace('/(auth)/login')} variant="secondary" />
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