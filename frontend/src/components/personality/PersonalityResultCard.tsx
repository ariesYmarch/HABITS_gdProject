import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import type { PersonalityType } from '../../types/personality';

interface PersonalityResultCardProps {
  label: string; // e.g. "현재의 나" or "이상적인 나"
  personalityType: PersonalityType | undefined;
  compact?: boolean;
}

export function PersonalityResultCard({
  label,
  personalityType,
  compact = false,
}: PersonalityResultCardProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  if (!personalityType) {
    return (
      <View style={[styles.card, compact && styles.cardCompact]}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </Text>
        <Text style={[styles.placeholder, { color: theme.textSecondary }]}>
          아직 분석되지 않았어요
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        { borderColor: theme.primaryColor + '30' },
      ]}>
      <Text style={[styles.label, { color: theme.primaryColor }]}>
        {label}
      </Text>
      <Text style={styles.emoji}>{personalityType.emoji}</Text>
      <Text
        style={[
          styles.typeName,
          compact && styles.typeNameCompact,
          { color: theme.textPrimary },
        ]}>
        {personalityType.nameKR}
      </Text>
      {!compact && (
        <>
          <Text style={[styles.typeEN, { color: theme.textSecondary }]}>
            {personalityType.nameEN}
          </Text>
          <Text style={[styles.desc, { color: theme.textSecondary }]}>
            {personalityType.description}
          </Text>
        </>
      )}

      {/* Hashtag chips */}
      <View style={styles.hashtagRow}>
        {personalityType.hashtags.map((tag) => (
          <View
            key={tag}
            style={[
              styles.hashtagChip,
              { backgroundColor: theme.primaryColor + '10' },
            ]}>
            <Text style={[styles.hashtagText, { color: theme.primaryColor }]}>
              {tag}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardCompact: {
    padding: 14,
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  typeName: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  typeNameCompact: {
    fontSize: 15,
  },
  typeEN: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
  },
  desc: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
    marginTop: 8,
  },
  hashtagChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  hashtagText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
