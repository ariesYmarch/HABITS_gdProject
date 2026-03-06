import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeStep({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🧘‍♀️</Text>
      <Text style={styles.title}>HABITS에 오신 것을 환영합니다</Text>
      <Text style={styles.description}>
        심리 이론 기반의 자아 탐색과{'\n'}AI 감정 분석을 통한{'\n'}개인 맞춤형 습관
        코칭 서비스
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('NameInput')}>
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0EB',
    padding: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#2193B0',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
