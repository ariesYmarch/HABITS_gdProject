import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { EMOTIONS } from '../../types/diary';
import type { DiaryEntry } from '../../types/diary';

interface DiaryListTabProps {
  startDate: string;
  endDate: string;
}

function getMoodEmoji(score: number): string {
  if (score >= 0.6) return '😊';
  if (score >= 0.2) return '🙂';
  if (score >= -0.2) return '😐';
  if (score >= -0.6) return '😔';
  return '😢';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[d.getDay()];
  return `${month}/${day} (${weekday})`;
}

function DiaryCard({
  entry,
  textPrimary,
  textSecondary,
  cardBg,
  primaryColor,
}: {
  entry: DiaryEntry;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  primaryColor: string;
}) {
  const emotionChips = entry.emotionTags
    .map((tag) => {
      const info = EMOTIONS.find((e) => e.type === tag || e.label === tag);
      return info ? { emoji: info.emoji, label: info.label, color: info.color } : null;
    })
    .filter(Boolean) as { emoji: string; label: string; color: string }[];

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      {/* Header: date + mood */}
      <View style={styles.cardHeader}>
        <Text style={[styles.dateText, { color: textPrimary }]}>
          {formatDate(entry.date)}
        </Text>
        <View style={styles.moodBadge}>
          <Text style={styles.moodEmoji}>{getMoodEmoji(entry.moodScore)}</Text>
          <Text
            style={[
              styles.moodScore,
              { color: entry.moodScore >= 0 ? '#10B981' : '#EF4444' },
            ]}>
            {entry.moodScore >= 0 ? '+' : ''}
            {entry.moodScore.toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Emotion chips */}
      {emotionChips.length > 0 && (
        <View style={styles.chipRow}>
          {emotionChips.map((chip, idx) => (
            <View
              key={idx}
              style={[styles.chip, { backgroundColor: chip.color + '15' }]}>
              <Text style={styles.chipEmoji}>{chip.emoji}</Text>
              <Text style={[styles.chipLabel, { color: chip.color }]}>
                {chip.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Text content preview */}
      {entry.textContent && entry.textContent.trim() !== '' && (
        <Text
          style={[styles.textPreview, { color: textSecondary }]}
          numberOfLines={2}>
          {entry.textContent}
        </Text>
      )}

    </View>
  );
}

export function DiaryListTab({ startDate, endDate }: DiaryListTabProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const diaryEntries = useAppStore((s) => s.diaryEntries);

  const filteredEntries = useMemo(() => {
    return diaryEntries
      .filter((e) => e.date >= startDate && e.date <= endDate)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [diaryEntries, startDate, endDate]);

  const renderItem = ({ item }: { item: DiaryEntry }) => (
    <DiaryCard
      entry={item}
      textPrimary={theme.textPrimary}
      textSecondary={theme.textSecondary}
      cardBg={theme.cardBackgroundColor}
      primaryColor={theme.primaryColor}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📔</Text>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        일기가 없어요
      </Text>
      <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
        일기 탭에서 오늘의 감정을 기록해보세요
      </Text>
    </View>
  );

  return (
    <FlatList
      data={filteredEntries}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '700',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moodEmoji: {
    fontSize: 18,
  },
  moodScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  chipEmoji: {
    fontSize: 13,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  textPreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  satBadge: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  satBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
  },
});
