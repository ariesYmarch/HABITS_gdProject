import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 마이페이지</Text>
      <Text style={styles.subtitle}>프로필 / 설정 (구현 예정)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});
