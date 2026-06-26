import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SupportActionStrip } from '../../components/SupportActionStrip';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { companyContent } from '../../content/companyContent';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

const bookingCategories = [
  {
    route: 'PackageBooking' as const,
    title: 'Packages',
    subtitle: 'Curated itineraries with stay, guides, and transfers',
    imageUrl: companyContent.packages[0]?.imageUrl,
  },
  {
    route: 'FlightBooking' as const,
    title: 'Flights',
    subtitle: 'Live search against the dedicated flight booking API',
    imageUrl: companyContent.flights[0]?.imageUrl,
  },
  {
    route: 'HotelBooking' as const,
    title: 'Hotels',
    subtitle: 'Standalone hotel availability and room booking flow',
    imageUrl: companyContent.hotels[0]?.imageUrl,
  },
];

export function BookingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen
      title="Booking hub"
      subtitle="Choose the travel service you want to book. Flights and hotels now have their own independent screens and backend endpoints."
      actions={<SupportActionStrip focus="book" />}>
      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Three dedicated booking flows</Text>
        <Text style={screenStyles.body}>
          Packages stay connected to the core VANIR booking mutation. Flights and hotels now search and confirm against the dedicated travel booking API layer.
        </Text>
      </SectionCard>

      <View style={styles.grid}>
        {bookingCategories.map(category => (
          <Pressable key={category.title} style={styles.card} onPress={() => navigation.navigate(category.route)}>
            {category.imageUrl ? <Image source={{ uri: category.imageUrl }} style={styles.image} /> : null}
            <View style={styles.body}>
              <Text style={styles.title}>{category.title}</Text>
              <Text style={styles.subtitle}>{category.subtitle}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 14,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 210,
  },
  body: {
    padding: 16,
    gap: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
