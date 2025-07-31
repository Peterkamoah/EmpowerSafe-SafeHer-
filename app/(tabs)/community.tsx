import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { db } from '@/firebase/config';
import { collection, query, orderBy, limit, getDocs, startAfter, DocumentData } from 'firebase/firestore';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Post {
  id: string;
  title: string;
  content: string;
}

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const first = query(collection(db, "CommunityPosts"), orderBy("createdAt", "desc"), limit(10));
    const documentSnapshots = await getDocs(first);
    const newPosts = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    setPosts(newPosts);
    setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length-1]);
    setLoading(false);
  };

  const fetchMorePosts = async () => {
    if (!lastVisible) return;
    setLoading(true);
    const next = query(collection(db, "CommunityPosts"), orderBy("createdAt", "desc"), startAfter(lastVisible), limit(10));
    const documentSnapshots = await getDocs(next);
    const newPosts = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    setPosts([...posts, ...newPosts]);
    setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length-1]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postCard} onPress={() => router.push({ pathname: '/(tabs)/PostDetailScreen', params: { title: item.title, content: item.content } })}>
      <ThemedText type="subtitle">{item.title}</ThemedText>
      <ThemedText numberOfLines={2}>{item.content}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={fetchMorePosts}
        onEndReachedThreshold={0.5}
        refreshing={loading}
        onRefresh={fetchPosts}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>Community</ThemedText>
            <ThemedText style={styles.subtitle}>
              Connect with others in a safe, supportive space
            </ThemedText>
          </View>
        }
        ListEmptyComponent={
          <ThemedText style={styles.placeholder}>No posts yet. Be the first to share!</ThemedText>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/CreatePostScreen')}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Layout.spacing.md,
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
  postCard: {
    backgroundColor: SafeHerColors.backgroundSecondary,
    padding: Layout.spacing.md,
    marginHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
  },
  placeholder: {
    textAlign: 'center',
    marginTop: Layout.spacing.xl,
    color: SafeHerColors.textSecondary,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: SafeHerColors.primary,
    borderRadius: 28,
    elevation: 8,
  },
});