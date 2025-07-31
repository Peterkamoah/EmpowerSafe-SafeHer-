import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

export default function CommunityScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Community</ThemedText>
        <ThemedText style={styles.subtitle}>
          Connect with others in a safe, supportive space
        </ThemedText>
      </View>
      
      <View style={styles.content}>
        <ThemedText style={styles.placeholder}>
          Community feed will be implemented here
        </ThemedText>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: SafeHerColors.textSecondary,
    fontSize: Layout.fontSize.md,
    textAlign: 'center',
  },
});