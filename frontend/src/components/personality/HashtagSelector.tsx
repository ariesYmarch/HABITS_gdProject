import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

interface HashtagSelectorProps {
  hashtags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  minSelection?: number;
  maxSelection?: number;
}

export function HashtagSelector({
  hashtags,
  selectedTags,
  onToggleTag,
  minSelection = 2,
  maxSelection = 6,
}: HashtagSelectorProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  const selectedCount = selectedTags.length;
  const isAtMax = selectedCount >= maxSelection;

  return (
    <View style={styles.container}>
      {/* Counter */}
      <View style={styles.counterRow}>
        <Text style={[styles.counterText, { color: theme.textSecondary }]}>
          선택:{' '}
          <Text
            style={{
              color:
                selectedCount >= minSelection
                  ? theme.primaryColor
                  : '#EF4444',
              fontWeight: '700',
            }}>
            {selectedCount}
          </Text>
          /{maxSelection}
        </Text>
        {selectedCount < minSelection && (
          <Text style={styles.minHint}>
            (최소 {minSelection}개 선택)
          </Text>
        )}
      </View>

      {/* FlowLayout tags */}
      <View style={styles.tagsContainer}>
        {hashtags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          const isDisabled = !isSelected && isAtMax;

          return (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagButton,
                isSelected && {
                  backgroundColor: theme.primaryColor,
                  borderColor: theme.primaryColor,
                },
                isDisabled && styles.tagDisabled,
              ]}
              onPress={() => onToggleTag(tag)}
              disabled={isDisabled}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.tagLabel,
                  isSelected && styles.tagLabelSelected,
                  isDisabled && styles.tagLabelDisabled,
                ]}>
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  counterText: {
    fontSize: 14,
  },
  minHint: {
    fontSize: 12,
    color: '#EF4444',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  tagDisabled: {
    opacity: 0.4,
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  tagLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tagLabelDisabled: {
    color: '#9CA3AF',
  },
});
