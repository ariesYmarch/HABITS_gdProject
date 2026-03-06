import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { GradientButton } from '../../components/common/GradientButton';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'NameInput'>;

const ICON_OPTIONS = ['😀', '😎', '🦊', '🐱', '🌸', '🌈', '⭐', '🎵'];

export function NameInputStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const setUserName = useAppStore((s) => s.setUserName);
  const setUserIcon = useAppStore((s) => s.setUserIcon);

  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('😀');

  const isValid = name.trim().length > 0;

  const handleNext = () => {
    setUserName(name.trim());
    setUserIcon(selectedIcon);
    navigation.navigate('CurrentPersonalityTest');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ProgressBar current={2} total={10} />

      <View style={styles.content}>
        <Text style={[styles.greeting, { color: theme.textPrimary }]}>
          반갑습니다! 👋
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          이름과 프로필 아이콘을 선택해주세요
        </Text>

        {/* 아이콘 선택 */}
        <View style={styles.iconSection}>
          <Text style={[styles.selectedIcon]}>{selectedIcon}</Text>
          <View style={styles.iconGrid}>
            {ICON_OPTIONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconButton,
                  selectedIcon === icon && {
                    backgroundColor: theme.primaryColor + '1A',
                    borderColor: theme.primaryColor,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setSelectedIcon(icon)}>
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
      </View>

      <View style={styles.buttonWrapper}>
        <GradientButton
          title="다음"
          onPress={handleNext}
          disabled={!isValid}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 32,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  selectedIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  input: {
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    color: '#1A1A2E',
  },
  buttonWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
  },
});
