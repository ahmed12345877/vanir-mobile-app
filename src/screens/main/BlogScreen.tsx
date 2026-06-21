import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { trpc } from '../../lib/trpc';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type BlogPost = {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  publishedAt?: string | null;
  readingTime?: number | null;
};

export function BlogScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchTerm, setSearchTerm] = useState('');
  const postsQuery = trpc.blog.list.useQuery({ limit: 20 });
  const posts = useMemo(() => ((postsQuery.data ?? []) as BlogPost[]), [postsQuery.data]);

  const filteredPosts = useMemo(
    () =>
      posts.filter(post => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) {
          return true;
        }
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.category?.toLowerCase().includes(query)
        );
      }),
    [posts, searchTerm],
  );

  return (
    <Screen title="Blog" subtitle="Mobile articles are wired to the same published blog feed that powers the website.">
      <TextInput
        placeholder="Search travel articles"
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.slug}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('BlogPost', { slug: item.slug, title: item.title })}>
            <SectionCard>
              <Text style={screenStyles.label}>{item.category ?? 'Travel guide'}</Text>
              <Text style={screenStyles.sectionTitle}>{item.title}</Text>
              <Text style={screenStyles.body}>{item.excerpt}</Text>
              <Text style={styles.metaText}>
                {item.readingTime ? `${item.readingTime} min read` : 'Travel article'} · {formatDate(item.publishedAt)}
              </Text>
            </SectionCard>
          </Pressable>
        )}
      />
    </Screen>
  );
}

function formatDate(value?: string | null) {
  if (!value) {
    return 'Recently published';
  }

  return new Date(value).toLocaleDateString();
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  list: {
    gap: 12,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
