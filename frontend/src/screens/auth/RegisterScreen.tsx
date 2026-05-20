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
  ScrollView,
} from 'react-native';
import { showAlert } from '../../components/common/AppAlert';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterScreen({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const register = useAppStore((s) => s.register);
  const isAuthLoading = useAppStore((s) => s.isAuthLoading);

  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');

  const emailValid = EMAIL_PATTERN.test(email.trim());
  const passwordValid = PASSWORD_PATTERN.test(password);
  const passwordsMatch = password === passwordConfirm && passwordConfirm.length > 0;
  const nicknameValid = nickname.trim().length >= 2;

  const isValid = emailValid && passwordValid && passwordsMatch && nicknameValid;

  const handleRegister = async () => {
    try {
      await register(email.trim().toLowerCase(), password, nickname.trim());
    } catch (e: any) {
      const detail = e?.response?.data?.detail || '회원가입에 실패했습니다';
      showAlert({ title: '회원가입 실패', message: detail });
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
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backText, { color: theme.textSecondary }]}>← 뒤로</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.greeting, { color: theme.textPrimary }]}>
            계정을 만들어볼까요?
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            이메일은 비밀번호 재설정에 사용돼요
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
          {email.length > 0 && !emailValid && (
            <Text style={styles.errorText}>올바른 이메일 형식이 아닙니다</Text>
          )}

          <TextInput
            style={[styles.input, { backgroundColor: theme.primaryColor + '0D' }]}
            placeholder="비밀번호 (8자 이상, 영문+숫자)"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {password.length > 0 && !passwordValid && (
            <Text style={styles.errorText}>
              8자 이상, 영문과 숫자를 모두 포함해야 합니다
            </Text>
          )}

          <TextInput
            style={[styles.input, { backgroundColor: theme.primaryColor + '0D' }]}
            placeholder="비밀번호 확인"
            placeholderTextColor="#9CA3AF"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
          />
          {passwordConfirm.length > 0 && !passwordsMatch && (
            <Text style={styles.errorText}>비밀번호가 일치하지 않습니다</Text>
          )}

          <TextInput
            style={[styles.input, { backgroundColor: theme.primaryColor + '0D' }]}
            placeholder="닉네임 (2자 이상)"
            placeholderTextColor="#9CA3AF"
            value={nickname}
            onChangeText={setNickname}
            maxLength={30}
          />

          <View style={styles.buttonWrapper}>
            {isAuthLoading ? (
              <ActivityIndicator size="large" color={theme.primaryColor} />
            ) : (
              <GradientButton
                title="가입하기"
                onPress={handleRegister}
                disabled={!isValid}
                style={styles.button}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  header: { paddingHorizontal: 24, paddingVertical: 12 },
  backText: { fontSize: 15 },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 40,
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
    marginBottom: 8,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonWrapper: { width: '100%', marginTop: 24 },
  button: { width: '100%' },
});
