import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export function ResetPasswordScreen({ navigation, route }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const confirmPasswordReset = useAppStore((s) => s.confirmPasswordReset);

  const insets = useSafeAreaInsets();
  const [token, setToken] = useState(route.params?.token || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const tokenValid = token.trim().length > 0;
  const passwordValid = PASSWORD_PATTERN.test(newPassword);
  const passwordsMatch = newPassword === confirm && confirm.length > 0;

  const isValid = tokenValid && passwordValid && passwordsMatch;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await confirmPasswordReset(token.trim(), newPassword);
      Alert.alert(
        '변경 완료',
        '비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.',
        [{ text: '확인', onPress: () => navigation.navigate('Login') }],
      );
    } catch (e: any) {
      const detail = e?.response?.data?.detail || '비밀번호 변경에 실패했습니다';
      Alert.alert('오류', detail);
    } finally {
      setSubmitting(false);
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: theme.textSecondary }]}>← 뒤로</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacerTop} />

      <View style={styles.content}>
        <Text style={[styles.greeting, { color: theme.textPrimary }]}>
          새 비밀번호 설정
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          메일로 받은 토큰과 새 비밀번호를 입력하세요
        </Text>

        {!route.params?.token && (
          <TextInput
            style={[styles.input, { backgroundColor: theme.primaryColor + '0D' }]}
            placeholder="재설정 토큰"
            placeholderTextColor="#9CA3AF"
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}

        <TextInput
          style={[styles.input, { backgroundColor: theme.primaryColor + '0D' }]}
          placeholder="새 비밀번호 (8자 이상, 영문+숫자)"
          placeholderTextColor="#9CA3AF"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        {newPassword.length > 0 && !passwordValid && (
          <Text style={styles.errorText}>
            8자 이상, 영문과 숫자를 모두 포함해야 합니다
          </Text>
        )}

        <TextInput
          style={[styles.input, { backgroundColor: theme.primaryColor + '0D' }]}
          placeholder="새 비밀번호 확인"
          placeholderTextColor="#9CA3AF"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
        />
        {confirm.length > 0 && !passwordsMatch && (
          <Text style={styles.errorText}>비밀번호가 일치하지 않습니다</Text>
        )}

        <View style={styles.buttonWrapper}>
          {submitting ? (
            <ActivityIndicator size="large" color={theme.primaryColor} />
          ) : (
            <GradientButton
              title="비밀번호 변경"
              onPress={handleSubmit}
              disabled={!isValid}
              style={styles.button}
            />
          )}
        </View>
      </View>

      <View style={styles.spacerBottom} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingVertical: 12 },
  backText: { fontSize: 15 },
  spacerTop: { flex: 0.5 },
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
    marginBottom: 8,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonWrapper: { width: '100%', marginTop: 16 },
  button: { width: '100%' },
});
