import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PlaceholderProps {
  title: string;
  step: number;
  onNext?: () => void;
  nextLabel?: string;
}

export function PlaceholderStep({
  title,
  step,
  onNext,
  nextLabel = '다음',
}: PlaceholderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step {step} / 10</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.placeholder}>🚧 구현 예정</Text>
      {onNext && (
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>{nextLabel}</Text>
        </TouchableOpacity>
      )}
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
  step: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#2193B0',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
