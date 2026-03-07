import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { EMOTIONS, EmotionType } from '../../types/diary';

interface EmotionTagSelectorProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export function EmotionTagSelector({
  selectedTags,
  onToggleTag,
}: EmotionTagSelectorProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  return (
    <View style={styles.container}>
      <View style={styles.tagsGrid}>
        {EMOTIONS.map((emotion) => {
          const isSelected = selectedTags.includes(emotion.type);
          return (
            <TouchableOpacity
              key={emotion.type}
              style={[
                styles.tag,
                isSelected
                  ? {
                      backgroundColor: emotion.color + '20',
                      borderColor: emotion.color,
                    }
                  : {
                      backgroundColor: theme.cardBackgroundColor,
                      borderColor: '#E5E7EB',
                    },
              ]}
              onPress={() => onToggleTag(emotion.type)}
              activeOpacity={0.7}>
              <Text style={styles.tagEmoji}>{emotion.emoji}</Text>
              <Text
                style={[
                  styles.tagLabel,
                  {
                    color: isSelected ? emotion.color : theme.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}>
                {emotion.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[styles.hint, { color: theme.textSecondary }]}>
        오늘 느낀 감정을 모두 선택해주세요
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  tagEmoji: {
    fontSize: 18,
  },
  tagLabel: {
    fontSize: 14,
  },
  hint: {
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
});
