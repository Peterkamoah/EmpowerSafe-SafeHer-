import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { Layout } from '@/constants/Layout';

export default function PostDetailScreen() {
  const { title, content } = useLocalSearchParams();

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.content}>{content}</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.md,
  },
  title: {
    marginBottom: Layout.spacing.lg,
  },
  content: {
    fontSize: Layout.fontSize.md,
    lineHeight: Layout.fontSize.md * 1.5,
  },
});