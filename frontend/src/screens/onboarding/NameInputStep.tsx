import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { GradientButton } from '../../components/common/GradientButton';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'NameInput'>;

export function NameInputStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const setUserName = useAppStore((s) => s.setUserName);
  const setUserIcon = useAppStore((s) => s.setUserIcon);

  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');

  const isValid = name.trim().length > 0;

  const handleNext = () => {
    setUserName(name.trim());
    setUserIcon('\uD83D\uDE00');
    navigation.navigate('Guide');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ProgressBar current={1} total={10} />

      <View style={styles.spacerTop} />

      <View style={styles.content}>
        <Text style={[styles.greeting, { color: theme.textPrimary }]}>
          반갑습니다! {'\uD83D\uDC4B'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          앱에서 사용할 이름을 알려주세요
        </Text>

        {/* 이름 입력 */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.primaryColor + '0D' },
          ]}
          placeholder="이름을 입력하세요"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
          maxLength={20}
          autoFocus
        />

        <View style={styles.buttonWrapper}>
          <GradientButton
            title="다음"
            onPress={handleNext}
            disabled={!isValid}
            style={styles.button}
          />
        </View>
      </View>

      <View style={styles.spacerBottom} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacerTop: {
    flex: 1,
  },
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
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 40,
  },
  button: {
    width: '100%',
  },
  spacerBottom: {
    flex: 1.2,
  },
});
