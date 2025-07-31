import React, { useState } from 'react';
import { View, StyleSheet, Switch, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StyledInput } from '@/components/ui/StyledInput';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { router } from 'expo-router';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

const userId = 'mockUser';

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (title.trim() === '' || content.trim() === '') {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'CommunityPosts'), {
        title,
        content,
        isAnonymous,
        authorId: isAnonymous ? null : userId,
        createdAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Post created successfully.');
      router.back();
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert('Error', 'Could not create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create a New Post</ThemedText>
      <StyledInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter a title for your post"
      />
      <StyledInput
        label="Content"
        value={content}
        onChangeText={setContent}
        placeholder="Share your thoughts..."
        multiline
        numberOfLines={6}
      />
      <View style={styles.anonymousContainer}>
        <ThemedText>Post Anonymously</ThemedText>
        <Switch
          trackColor={{ false: "#767577", true: SafeHerColors.primary }}
          thumbColor={isAnonymous ? "#f4f3f4" : "#f4f3f4"}
          onValueChange={setIsAnonymous}
          value={isAnonymous}
        />
      </View>
      <PrimaryButton title="Post" onPress={handlePost} loading={loading} disabled={loading} />
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
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
});