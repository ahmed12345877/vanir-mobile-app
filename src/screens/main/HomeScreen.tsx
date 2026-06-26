import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IconBadge } from '../../components/IconBadge';
import { SupportActionStrip } from '../../components/SupportActionStrip';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { companyContent } from '../../content/companyContent';
import { useAuth } from '../../context/AuthContext';
import { trpc } from '../../lib/trpc';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

const quickActions = [
  { label: 'Book a package', route: 'Booking' as const, icon: 'booking' as const },
  { label: 'Travel essentials', route: 'TravelEssentials' as const, icon: 'reviews' as const },
  { label: 'Read reviews', route: 'Reviews' as const, icon: 'reviews' as const },
  { label: 'Sign in', route: 'Login' as const, icon: 'signIn' as const },
];

export function HomeScreen() {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const offersQuery = trpc.offers.listActive.useQuery();
  const blogQuery = trpc.blog.list.useQuery({ limit: 3 });
  const galleryQuery = trpc.gallery.listVisible.useQuery();
  const destinations = companyContent.destinations.slice(0, 4);
  const packages = companyContent.packages.slice(0, 4);
  const testimonials = companyContent.testimonials.slice(0, 2);
  const articles = companyContent.articles.slice(0, 3);

  return (
    <Screen
      title={companyContent.brand}
      subtitle={companyContent.tagline}
      actions={<SupportActionStrip focus="book" />}>
      <SectionCard>
        <Text style={screenStyles.label}>{isAuthenticated ? 'Signed in' : 'Guest mode'}</Text>
        <Text style={screenStyles.sectionTitle}>{companyContent.heroTitle}</Text>
        <Text style={screenStyles.body}>{companyContent.heroBody}</Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Booking')}>
          <Text style={styles.primaryButtonText}>Book Your Trip Now</Text>
        </Pressable>
        <View style={styles.statsRow}>
          {companyContent.stats.map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <View style={styles.actionGrid}>
        {quickActions.map(action => (
          <Pressable key={action.label} style={styles.actionTile} onPress={() => navigation.navigate(action.route)}>
            <IconBadge name={action.icon} size={20} active />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>What VANIR GROUP offers you</Text>
        <View style={styles.serviceGrid}>
          {companyContent.services.map(service => (
            <View key={service.title} style={styles.serviceCard}>
              <IconBadge name={service.icon} size={18} active />
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceText}>{service.description}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Featured destinations</Text>
        <View style={styles.featureGrid}>
          {destinations.map(destination => (
            <View key={destination.name} style={styles.featureCard}>
              <Image source={{ uri: destination.imageUrl }} style={styles.featureImage} />
              <Text style={screenStyles.label}>{destination.category}</Text>
              <Text style={styles.featureTitle}>{destination.name}</Text>
              <Text style={screenStyles.body}>{destination.region}</Text>
              <Text style={styles.featureMeta}>{destination.travelers}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Top travel packages</Text>
        <View style={styles.packageList}>
          {packages.map(packageItem => (
            <View key={packageItem.title} style={styles.packageCard}>
              <Image source={{ uri: packageItem.imageUrl }} style={styles.packageImage} />
              <View style={styles.packageBody}>
                <Text style={screenStyles.label}>{packageItem.category}</Text>
                <Text style={styles.featureTitle}>{packageItem.title}</Text>
                <Text style={screenStyles.body}>{packageItem.region}</Text>
                <Text style={styles.packageMeta}>{packageItem.price} · {packageItem.duration} · {packageItem.rating}</Text>
              </View>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Client testimonials</Text>
        <View style={styles.testimonialList}>
          {testimonials.map(testimonial => (
            <View key={testimonial.name} style={styles.testimonialCard}>
              <Image source={{ uri: testimonial.avatarUrl }} style={styles.avatar} />
              <View style={styles.testimonialBody}>
                <Text style={styles.featureTitle}>{testimonial.name}</Text>
                <Text style={screenStyles.label}>{testimonial.role}</Text>
                <Text style={screenStyles.body}>{testimonial.quote}</Text>
                <Text style={styles.featureMeta}>{testimonial.location}</Text>
              </View>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Travel blog & news</Text>
        <View style={styles.articleList}>
          {articles.map(article => (
            <Pressable key={article.slug} onPress={() => navigation.navigate('BlogPost', { slug: article.slug, title: article.title })}>
              <View style={styles.articleCard}>
                <Image source={{ uri: article.imageUrl }} style={styles.articleImage} />
                <View style={styles.articleBody}>
                  <Text style={screenStyles.label}>{article.publishedAt}</Text>
                  <Text style={styles.featureTitle}>{article.title}</Text>
                  <Text style={screenStyles.body}>{article.excerpt}</Text>
                  <Text style={styles.featureMeta}>{article.readingTime}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Live platform snapshot</Text>
        <View style={styles.metricRow}>
          <Metric label="Active offers" value={offersQuery.data?.length ?? 0} />
          <Metric label="Blog posts" value={blogQuery.data?.length ?? 0} />
          <Metric label="Gallery items" value={galleryQuery.data?.length ?? 0} />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>What was mirrored from web</Text>
        <Text style={screenStyles.body}>
          Home, destinations, offers, gallery, testimonials, blog, bookings, reviews, and profile were chosen as the strongest mobile-first slices from the current website.
        </Text>
        <View style={styles.contactPanel}>
          <Text style={styles.contactLabel}>Need help?</Text>
          <Text style={styles.contactText}>{companyContent.contact.email}</Text>
          <Text style={styles.contactText}>{companyContent.contact.phone}</Text>
        </View>
      </SectionCard>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  statCard: {
    flexBasis: '48%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  statValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionTile: {
    flexBasis: '31%',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    minHeight: 88,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  actionLabel: {
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: colors.background,
    fontWeight: '700',
  },
  serviceGrid: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  serviceTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  serviceText: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  featureGrid: {
    gap: 12,
  },
  featureCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  featureImage: {
    width: '100%',
    height: 160,
  },
  featureTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  featureMeta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  packageList: {
    gap: 12,
  },
  packageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  packageImage: {
    width: '100%',
    height: 150,
  },
  packageBody: {
    padding: 14,
    gap: 6,
  },
  packageMeta: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  testimonialList: {
    gap: 12,
  },
  testimonialCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  testimonialBody: {
    flex: 1,
    gap: 4,
  },
  articleList: {
    gap: 12,
  },
  articleCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  articleImage: {
    width: '100%',
    height: 150,
  },
  articleBody: {
    padding: 14,
    gap: 6,
  },
  contactPanel: {
    marginTop: 12,
    gap: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    backgroundColor: colors.surfaceAlt,
  },
  contactLabel: {
    color: colors.primarySoft,
    fontWeight: '700',
  },
  contactText: {
    color: colors.textSecondary,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  metricValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '700',
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
