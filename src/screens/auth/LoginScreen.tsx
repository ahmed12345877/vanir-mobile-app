import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, SectionCard } from '../../components/Screen';
import { isGoogleSignInConfigured } from '../../config/appConfig';
import { useAuth } from '../../context/AuthContext';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn, signUp, signInGoogle, isLoading, error } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleEmailAuth() {
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(name, email, password);
      }
      navigation.goBack();
    } catch (authError) {
      Alert.alert('Authentication failed', authError instanceof Error ? authError.message : 'Please try again.');
    }
  }

  async function handleGoogleAuth() {
    try {
      await signInGoogle();
      navigation.goBack();
    } catch (authError) {
      Alert.alert('Google sign-in failed', authError instanceof Error ? authError.message : 'Please try again.');
    }
  }

  return (
    <Screen
      title={mode === 'signin' ? 'Welcome back' : 'Create your account'}
      subtitle="Use the same Firebase-backed identity flow as the web app, then continue into the existing VANIR backend.">
      <SectionCard>
        <View style={styles.toggleRow}>
          <Pressable style={[styles.toggleButton, mode === 'signin' && styles.toggleButtonActive]} onPress={() => setMode('signin')}>
            <Text style={[styles.toggleText, mode === 'signin' && styles.toggleTextActive]}>Sign in</Text>
          </Pressable>
          <Pressable style={[styles.toggleButton, mode === 'signup' && styles.toggleButtonActive]} onPress={() => setMode('signup')}>
            <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>Sign up</Text>
          </Pressable>
        </View>

        {mode === 'signup' ? (
          <TextInput
            placeholder="Full name"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        ) : null}

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable style={styles.primaryButton} onPress={handleEmailAuth} disabled={isLoading}>
          <Text style={styles.primaryButtonText}>{isLoading ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}</Text>
        </Pressable>

        <Pressable style={[styles.secondaryButton, !isGoogleSignInConfigured && styles.secondaryButtonDisabled]} onPress={handleGoogleAuth} disabled={isLoading || !isGoogleSignInConfigured}>
          <Text style={styles.secondaryButtonText}>
            {isGoogleSignInConfigured ? 'Continue with Google' : 'Configure Google client ID to enable Google sign-in'}
          </Text>
        </Pressable>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.background,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.background,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  secondaryButtonDisabled: {
    opacity: 0.55,
  },
  errorText: {
    color: colors.danger,
  },
});
