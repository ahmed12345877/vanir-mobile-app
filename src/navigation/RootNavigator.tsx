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

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}>
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
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book your trip' }} />
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
