import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { showAlert } from '../../components/common/AppAlert';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const login = useAppStore((s) => s.login);
  const isAuthLoading = useAppStore((s) => s.isAuthLoading);

  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid = email.trim().length > 0 && password.length > 0;

  const handleLogin = async () => {
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (e: any) {
      const detail = e?.response?.data?.detail || '로그인에 실패했습니다';
      showAlert({ title: '로그인 실패', message: detail });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundColor,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 24,
        },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.spacerTop} />

      <View style={styles.content}>
        <Text style={[styles.greeting, { color: theme.textPrimary }]}>
          환영합니다
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          이메일로 로그인하거나 회원가입을 시작해보세요
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: theme.primaryColor + '0D' }]}
          placeholder="이메일"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={[styles.input, { backgroundColor: theme.primaryColor + '0D' }]}
          placeholder="비밀번호"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotWrapper}>
          <Text style={[styles.forgotText, { color: theme.textSecondary }]}>
            비밀번호를 잊으셨나요?
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonWrapper}>
          {isAuthLoading ? (
            <ActivityIndicator size="large" color={theme.primaryColor} />
          ) : (
            <GradientButton
              title="로그인"
              onPress={handleLogin}
              disabled={!isValid}
              style={styles.button}
            />
          )}
        </View>

        <View style={styles.registerRow}>
          <Text style={[styles.registerPrompt, { color: theme.textSecondary }]}>
            아직 계정이 없으신가요?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.registerLink, { color: theme.primaryColor }]}>
              회원가입
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.spacerBottom} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  spacerTop: { flex: 0.6 },
  spacerBottom: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    color: '#1A1A2E',
    width: '100%',
    marginBottom: 12,
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
  },
  buttonWrapper: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  registerPrompt: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
