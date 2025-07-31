import React, { useState } from 'react';
import { View, StyleSheet, Switch, Platform, Image, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StyledInput } from '@/components/ui/StyledInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { storage, db } from '@/firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as Crypto from 'expo-crypto';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

const userId = 'mockUser';

export default function ReportIncidentScreen() {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (description.trim() === '' || location.trim() === '') {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setUploading(true);
    let mediaUrl = '';

    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const uuid = Crypto.randomUUID();
      const storageRef = ref(storage, `reports/${userId}/${uuid}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
          },
          (error) => {
            console.error("Upload failed:", error);
            setUploading(false);
            reject(error);
          },
          async () => {
            mediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          }
        );
      });
    }

    try {
      await addDoc(collection(db, 'Reports'), {
        description,
        location,
        incidentDate: date,
        mediaUrl,
        isAnonymous,
        reportingUserId: isAnonymous ? null : userId,
        createdAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Incident reported successfully.');
      // Clear form
      setDescription('');
      setLocation('');
      setDate(new Date());
      setImage(null);
      setIsAnonymous(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert('Error', 'Could not submit report.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Report an Incident</ThemedText>
      <StyledInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe what happened"
        multiline
        numberOfLines={4}
      />
      <StyledInput
        label="Location"
        value={location}
        onChangeText={setLocation}
        placeholder="e.g., 'Main Street & 2nd Ave'"
      />
      <View style={styles.dateContainer}>
        <ThemedText>Date & Time</ThemedText>
        <PrimaryButton title="Select Date" onPress={() => setShowDatePicker(true)} />
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <PrimaryButton title="Upload Photo/Video" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <View style={styles.anonymousContainer}>
        <ThemedText>Report Anonymously</ThemedText>
        <Switch
          trackColor={{ false: "#767577", true: SafeHerColors.primary }}
          thumbColor={isAnonymous ? "#f4f3f4" : "#f4f3f4"}
          onValueChange={setIsAnonymous}
          value={isAnonymous}
        />
      </View>
      <PrimaryButton title="Submit Report" onPress={handleSubmit} loading={uploading} disabled={uploading} />
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
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Layout.spacing.md,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: Layout.borderRadius.md,
    marginVertical: Layout.spacing.md,
  },
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
});