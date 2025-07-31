import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PanicButton } from '@/components/ui/PanicButton';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

export default function HomeScreen() {
  const handlePanicPress = () => {
    // TODO: Implement panic alert logic
    Alert.alert(
      'Emergency Alert Activated',
      'This will be implemented in Task 3 with location tracking and emergency contacts notification.',
      [{ text: 'OK' }]
    );
  };

  const handleReportIncident = () => {
    // TODO: Navigate to report incident screen
    Alert.alert('Report Incident', 'This feature will be implemented in Task 4.');
  };

  const handleShareLocation = () => {
    // TODO: Implement location sharing
    Alert.alert('Share Location', 'This feature will be implemented with location permissions.');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>SafeHer</ThemedText>
        <ThemedText style={styles.subtitle}>
          Your safety is our priority
        </ThemedText>
      </View>
      
      <View style={styles.content}>
        <View style={styles.panicButtonContainer}>
          <PanicButton onLongPress={handlePanicPress} />
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleReportIncident}>
            <IconSymbol name="doc.text" size={24} color={SafeHerColors.primary} />
            <ThemedText style={styles.actionButtonText}>Report Incident</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShareLocation}>
            <IconSymbol name="location" size={24} color={SafeHerColors.primary} />
            <ThemedText style={styles.actionButtonText}>Share Location</ThemedText>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
    paddingTop: Layout.spacing.xl,
  },
  title: {
    color: SafeHerColors.primary,
    fontSize: Layout.fontSize.xxxl,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    color: SafeHerColors.textSecondary,
    fontSize: Layout.fontSize.md,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panicButtonContainer: {
    marginBottom: Layout.spacing.xxl,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: Layout.spacing.md,
  },
  actionButton: {
    alignItems: 'center',
    padding: Layout.spacing.md,
    backgroundColor: SafeHerColors.backgroundSecondary,
    borderRadius: Layout.borderRadius.md,
    minWidth: 120,
  },
  actionButtonText: {
    marginTop: Layout.spacing.sm,
    fontSize: Layout.fontSize.sm,
    color: SafeHerColors.textPrimary,
    textAlign: 'center',
  },
});
