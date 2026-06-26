import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IconBadge } from '../components/IconBadge';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import type { MainTabParamList, RootStackParamList } from './types';
import { BlogScreen } from '../screens/main/BlogScreen';
import { BlogPostScreen } from '../screens/main/BlogPostScreen';
import { AIStudioScreen } from '../screens/main/AIStudioScreen';
import { BookingScreen } from '../screens/main/BookingScreen';
import { ContactScreen } from '../screens/main/ContactScreen';
import { FlightBookingScreen } from '../screens/main/FlightBookingScreen';
import { GalleryScreen } from '../screens/main/GalleryScreen';
import { HotelBookingScreen } from '../screens/main/HotelBookingScreen';
import { HomeScreen } from '../screens/main/HomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OffersScreen } from '../screens/main/OffersScreen';
import { PackageBookingScreen } from '../screens/main/PackageBookingScreen';
import { LegalCenterScreen } from '../screens/main/LegalCenterScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { ReviewsScreen } from '../screens/main/ReviewsScreen';
import { TravelEssentialsScreen } from '../screens/main/TravelEssentialsScreen';
import { UnifiedCheckoutScreen } from '../screens/main/UnifiedCheckoutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, string> = {
  Home: 'Home',
  Gallery: 'Gallery',
  Offers: 'Offers',
  AIStudio: 'AIStudio',
  Profile: 'Profile',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <IconBadge name={tabIcons[route.name] as keyof typeof tabIcons} size={(size ?? 22) - 4} active={color === colors.primary} />
        ),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Offers" component={OffersScreen} />
      <Tab.Screen name="AIStudio" component={AIStudioScreen} options={{ title: 'AI Studio' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Syncing your VANIR session…</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Booking hub' }} />
      <Stack.Screen name="PackageBooking" component={PackageBookingScreen} options={{ title: 'Packages' }} />
      <Stack.Screen name="FlightBooking" component={FlightBookingScreen} options={{ title: 'Flights' }} />
      <Stack.Screen name="HotelBooking" component={HotelBookingScreen} options={{ title: 'Hotels' }} />
      <Stack.Screen name="TravelEssentials" component={TravelEssentialsScreen} options={{ title: 'Travel essentials' }} />
      <Stack.Screen name="UnifiedCheckout" component={UnifiedCheckoutScreen} options={{ title: 'Unified checkout' }} />
      <Stack.Screen name="AIStudio" component={AIStudioScreen} options={{ title: 'AI Studio' }} />
      <Stack.Screen name="LegalCenter" component={LegalCenterScreen} options={{ title: 'Legal center' }} />
      <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Travel desk' }} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} options={{ title: 'Traveler reviews' }} />
      <Stack.Screen
        name="BlogPost"
        component={BlogPostScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}

const styles = {
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 12,
  } as const,
  loadingText: {
    color: colors.textSecondary,
  } as const,
};
