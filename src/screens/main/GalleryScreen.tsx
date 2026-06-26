import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { IconBadge } from '../../components/IconBadge';
import { SupportActionStrip } from '../../components/SupportActionStrip';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { companyContent } from '../../content/companyContent';
import { pickFirstMediaUrl, resolveMediaUrl } from '../../lib/media';
import { trpc } from '../../lib/trpc';
import { colors } from '../../theme/colors';

type GalleryItem = {
  id?: string | number;
  imageUrl?: string;
  coverImageUrl?: string;
  thumbnailUrl?: string;
  title?: string;
  category?: string;
  location?: string;
  description?: string;
};

export function GalleryScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const galleryQuery = trpc.gallery.listVisible.useQuery();
  const websiteItems = useMemo(
    () =>
      companyContent.gallery.map(item => ({
        id: item.title,
        imageUrl: item.imageUrl,
        coverImageUrl: undefined,
        thumbnailUrl: undefined,
        title: item.title,
        category: item.category,
        location: item.description,
        description: item.description,
      } satisfies GalleryItem)),
    [],
  );
  const items = useMemo(
    () => [...websiteItems, ...((galleryQuery.data ?? []) as GalleryItem[])],
    [galleryQuery.data, websiteItems],
  );

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
    <Screen
      title="Visual Gallery"
      subtitle="A more premium visual browsing experience with stronger image framing, cleaner filters, and better mobile rhythm."
      actions={<SupportActionStrip focus="whatsapp" />}>
      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Visual story</Text>
        <Text style={screenStyles.body}>
          Filter by category, tap a destination, and keep the discovery flow on device. Use WhatsApp only when you want a direct human handoff.
        </Text>
      </SectionCard>
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
            {pickFirstMediaUrl(item.imageUrl, item.coverImageUrl, item.thumbnailUrl) ? (
              <View style={styles.mediaFrame}>
                <Image source={{ uri: pickFirstMediaUrl(item.imageUrl, item.coverImageUrl, item.thumbnailUrl) ?? undefined }} style={styles.mediaImage} />
              </View>
            ) : (
              <View style={styles.mediaPlaceholder}>
                <IconBadge name="imageOff" size={18} />
                <Text style={styles.placeholderText}>No image attached to this item yet</Text>
              </View>
            )}
            <Text style={screenStyles.label}>{item.category ?? 'Experience'}</Text>
            <Text style={styles.galleryTitle}>{item.title ?? 'Untitled gallery item'}</Text>
            <Text style={screenStyles.body}>{item.location ?? item.description ?? 'Available from the existing VANIR gallery feed.'}</Text>
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
  galleryTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  mediaFrame: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  mediaImage: {
    width: '100%',
    height: 220,
  },
  mediaPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    minHeight: 180,
    gap: 10,
    marginTop: 4,
    padding: 16,
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
  },
});
