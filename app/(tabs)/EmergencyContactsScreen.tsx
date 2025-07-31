import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StyledInput } from '@/components/ui/StyledInput';
import { Ionicons } from '@expo/vector-icons';
import { db } from '@/firebase/config';
import { collection, addDoc, deleteDoc, onSnapshot, doc, serverTimestamp } from 'firebase/firestore';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

// Mock user ID for now
const userId = 'mockUser';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export default function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!userId) return;
    const subCollectionRef = collection(db, 'Users', userId, 'EmergencyContacts');
    const unsubscribe = onSnapshot(subCollectionRef, (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
      setContacts(contactsData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddContact = async () => {
    if (name.trim() === '' || phone.trim() === '') {
      Alert.alert('Error', 'Please enter a name and phone number.');
      return;
    }
    if (!userId) return;
    try {
      const subCollectionRef = collection(db, 'Users', userId, 'EmergencyContacts');
      await addDoc(subCollectionRef, { name, phone, createdAt: serverTimestamp() });
      setName('');
      setPhone('');
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding contact:", error);
      Alert.alert('Error', 'Could not add contact. Please try again.');
    }
  };

  const handleDeleteContact = (contactId: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!userId) return;
            try {
              const docRef = doc(db, 'Users', userId, 'EmergencyContacts', contactId);
              await deleteDoc(docRef);
            } catch (error) {
              console.error("Error deleting contact:", error);
              Alert.alert('Error', 'Could not delete contact. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <View style={styles.contactItem}>
      <View>
        <ThemedText style={styles.contactName}>{item.name}</ThemedText>
        <ThemedText style={styles.contactPhone}>{item.phone}</ThemedText>
      </View>
      <TouchableOpacity onPress={() => handleDeleteContact(item.id)}>
        <Ionicons name="trash-bin" size={24} color={SafeHerColors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ThemedText type="title" style={styles.title}>Emergency Contacts</ThemedText>
        }
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>No emergency contacts added yet.</ThemedText>
        }
      />
      <PrimaryButton title="Add New Contact" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <ThemedText type="subtitle" style={styles.modalTitle}>Add New Contact</ThemedText>
            <StyledInput
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter contact's name"
            />
            <StyledInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
            <View style={styles.modalButtons}>
              <PrimaryButton title="Cancel" onPress={() => setModalVisible(false)} variant="secondary" />
              <PrimaryButton title="Add Contact" onPress={handleAddContact} />
            </View>
          </View>
        </View>
      </Modal>
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
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
    backgroundColor: SafeHerColors.backgroundSecondary,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
  },
  contactName: {
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: Layout.fontSize.sm,
    color: SafeHerColors.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Layout.spacing.xl,
    color: SafeHerColors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: SafeHerColors.backgroundPrimary,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: Layout.spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: Layout.spacing.md,
  },
});