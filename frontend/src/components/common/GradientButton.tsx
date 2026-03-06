import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function GradientButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}: GradientButtonProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  if (disabled) {
    return (
      <TouchableOpacity
        style={[styles.button, styles.disabledButton, style]}
        disabled
        activeOpacity={0.7}>
        <Text style={[styles.text, styles.disabledText, textStyle]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
      <LinearGradient
        colors={theme.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});
