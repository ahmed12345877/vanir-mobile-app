import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { CartProvider } from './src/context/CartContext';
import { AppProviders } from './src/lib/trpc';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    primary: colors.primary,
    border: colors.border,
  },
};

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <AuthProvider>
          <CartProvider>
            <NavigationContainer theme={navigationTheme}>
              <StatusBar barStyle="light-content" backgroundColor={colors.background} />
              <RootNavigator />
            </NavigationContainer>
          </CartProvider>
        </AuthProvider>
      </AppProviders>
    </SafeAreaProvider>
  );
}

export default App;
