import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { trpc } from '../../lib/trpc';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogPost'>;

type BlogPost = {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  readingTime?: number | null;
  publishedAt?: string | null;
};

export function BlogPostScreen({ route }: Props) {
  const postQuery = trpc.blog.getBySlug.useQuery({ slug: route.params.slug });
  const post = postQuery.data as BlogPost | undefined;

  return (
    <Screen title={route.params.title} subtitle="Full article content is resolved against the existing published blog endpoint.">
      {post ? (
        <SectionCard>
          <Text style={screenStyles.label}>{post.category ?? 'Travel guide'}</Text>
          <Text style={screenStyles.sectionTitle}>{post.title}</Text>
          <Text style={styles.metaText}>
            {post.readingTime ? `${post.readingTime} min read` : 'Travel article'} · {formatDate(post.publishedAt)}
          </Text>
          <Text style={screenStyles.body}>{post.excerpt}</Text>
          <Text style={styles.contentText}>{post.content}</Text>
        </SectionCard>
      ) : (
        <Text style={styles.loadingText}>Loading article…</Text>
      )}
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
  metaText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  contentText: {
    color: colors.textPrimary,
    lineHeight: 24,
  },
  loadingText: {
    color: colors.textSecondary,
  },
});
