import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { StyledInput } from '@/components/ui/StyledInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function ProfileScreen() {
  const [name, setName] = useState('Jane Doe');

  const handleSaveChanges = () => {
    Alert.alert('Changes Saved', `Your name has been updated to ${name}.`);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Profile</ThemedText>
        <ThemedText style={styles.subtitle}>
          Manage your safety settings and emergency contacts
        </ThemedText>
      </View>

      <View style={styles.profileSection}>
        <StyledInput
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
        />
        <PrimaryButton title="Save Changes" onPress={handleSaveChanges} />
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/EmergencyContactsScreen')}>
          <View style={styles.menuItemLeft}>
            <IconSymbol name="person.2.fill" size={24} color={SafeHerColors.primary} />
            <ThemedText style={styles.menuItemText}>Emergency Contacts</ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={20} color={SafeHerColors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <IconSymbol name="gear" size={24} color={SafeHerColors.primary} />
            <ThemedText style={styles.menuItemText}>Settings</ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={20} color={SafeHerColors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <IconSymbol name="questionmark.circle" size={24} color={SafeHerColors.primary} />
            <ThemedText style={styles.menuItemText}>Help & Support</ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={20} color={SafeHerColors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.md,
  },
  header: {
    marginBottom: Layout.spacing.xl,
    paddingTop: Layout.spacing.lg,
  },
  title: {
    color: SafeHerColors.primary,
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    color: SafeHerColors.textSecondary,
    fontSize: Layout.fontSize.md,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    marginBottom: Layout.spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    backgroundColor: SafeHerColors.backgroundSecondary,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: Layout.spacing.md,
    fontSize: Layout.fontSize.md,
    color: SafeHerColors.textPrimary,
  },
});