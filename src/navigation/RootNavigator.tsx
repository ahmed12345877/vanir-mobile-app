import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import type { MainTabParamList, RootStackParamList } from './types';
import { BlogScreen } from '../screens/main/BlogScreen';
import { BlogPostScreen } from '../screens/main/BlogPostScreen';
import { BookingScreen } from '../screens/main/BookingScreen';
import { GalleryScreen } from '../screens/main/GalleryScreen';
import { HomeScreen } from '../screens/main/HomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OffersScreen } from '../screens/main/OffersScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { ReviewsScreen } from '../screens/main/ReviewsScreen';
import { AIStudioScreen } from '../screens/main/AIStudioScreen';
import { SearchResultsScreen } from '../screens/main/SearchResultsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, active }: { label: string; active: boolean }) {
  const icons: Record<string, { active: string; inactive: string }> = {
    Home: { active: '⌂', inactive: '⌂' },
    Gallery: { active: '◫', inactive: '◫' },
    Offers: { active: '◈', inactive: '◈' },
    Blog: { active: '≡', inactive: '≡' },
    Profile: { active: '◉', inactive: '◉' },
  };
  const icon = icons[label] ?? { active: '●', inactive: '○' };
  return (
    <Text
      style={{
        fontSize: 16,
        color: active ? colors.primary : colors.textMuted,
      }}>
      {active ? icon.active : icon.inactive}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} active={focused} />,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Offers" component={OffersScreen} />
      <Tab.Screen name="Blog" component={BlogScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingBrand}>VANIR</Text>
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 24 }} />
        <Text style={styles.loadingText}>Preparing your experience…</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AIStudio"
        component={AIStudioScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: 'Complete Booking' }}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{ title: 'Traveler Reviews' }}
      />
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
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.background,
    gap: 8,
  },
  loadingBrand: {
    fontSize: 42,
    fontWeight: '700' as const,
    color: colors.primary,
    letterSpacing: 12,
    fontFamily: 'Georgia',
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 13,
    letterSpacing: 1.5,
    marginTop: 8,
  },
};
