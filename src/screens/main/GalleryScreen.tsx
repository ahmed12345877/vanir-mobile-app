import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { trpc } from '../../lib/trpc';
import { colors } from '../../theme/colors';

type GalleryItem = {
  id?: string | number;
  imageUrl?: string;
  title?: string;
  category?: string;
  location?: string;
  description?: string;
};

export function GalleryScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const galleryQuery = trpc.gallery.listVisible.useQuery();
  const items = useMemo(() => ((galleryQuery.data ?? []) as GalleryItem[]), [galleryQuery.data]);

  const categories = useMemo(() => {
    const values = new Set(items.map(item => item.category).filter(Boolean));
    return ['All', ...Array.from(values)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return items;
    }
    return items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <Screen title="Gallery" subtitle="Public visual content comes from the same gallery data used by the web experience.">
      <View style={styles.filters}>
        {categories.map(category => (
          <Pressable
            key={category}
            style={[styles.filterChip, selectedCategory === category && styles.filterChipActive]}
            onPress={() => setSelectedCategory(category ?? 'All')}>
            <Text style={[styles.filterText, selectedCategory === category && styles.filterTextActive]}>{category}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => String(item.id ?? index)}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SectionCard>
            <Text style={screenStyles.label}>{item.category ?? 'Experience'}</Text>
            <Text style={screenStyles.sectionTitle}>{item.title ?? 'Untitled gallery item'}</Text>
            <Text style={screenStyles.body}>{item.location ?? item.description ?? 'Available from the existing VANIR gallery feed.'}</Text>
            {item.imageUrl ? <Text style={styles.imageHint}>{item.imageUrl}</Text> : null}
          </SectionCard>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No gallery items are available yet.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.background,
  },
  list: {
    gap: 12,
  },
  imageHint: {
    color: colors.textMuted,
    fontSize: 12,
  },
  emptyText: {
    color: colors.textSecondary,
  },
});
