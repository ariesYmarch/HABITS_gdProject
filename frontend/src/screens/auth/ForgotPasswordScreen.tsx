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

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordScreen({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const requestPasswordReset = useAppStore((s) => s.requestPasswordReset);

  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid = EMAIL_PATTERN.test(email.trim());

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await requestPasswordReset(email.trim().toLowerCase());
      showAlert({
        title: '메일 발송 완료',
        message: '입력한 이메일로 재설정 링크를 보냈습니다. 메일함을 확인해주세요.',
        actions: [{ label: '확인', primary: true, onPress: () => navigation.goBack() }],
      });
    } catch (e: any) {
      const detail = e?.response?.data?.detail || '메일 발송에 실패했습니다';
      showAlert({ title: '오류', message: detail });
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
          비밀번호를 잊으셨나요?
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          가입한 이메일로 재설정 링크를 보내드릴게요
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

        <View style={styles.buttonWrapper}>
          {submitting ? (
            <ActivityIndicator size="large" color={theme.primaryColor} />
          ) : (
            <GradientButton
              title="재설정 메일 보내기"
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
  spacerTop: { flex: 0.6 },
  spacerBottom: { flex: 1.2 },
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
    marginBottom: 24,
  },
  buttonWrapper: { width: '100%' },
  button: { width: '100%' },
});
