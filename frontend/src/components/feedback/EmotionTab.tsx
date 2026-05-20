import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { EMOTION_COLORS, EMOTION_LABELS } from '../../data/emotionKeywords';
import { EMOTIONS } from '../../types/diary';
import type { EmotionType } from '../../types/diary';

interface EmotionTabProps {
  startDate: string;
  endDate: string;
}

function getDatesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start + 'T00:00:00');
  const last = new Date(end + 'T00:00:00');
  while (current <= last) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/** Simple mood line chart using SVG */
function MoodLineChart({
  data,
  color,
}: {
  data: { date: string; score: number }[];
  color: string;
}) {
  if (data.length === 0) return null;

  const W = 300;
  const H = 100;
  const padX = 20;
  const padY = 15;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const points = data.map((item, idx) => {
    const x = padX + (data.length > 1 ? (idx / (data.length - 1)) * chartW : chartW / 2);
    // score is -1 to 1, map to chartH (inverted y)
    const y = padY + (1 - (item.score + 1) / 2) * chartH;
    return { x, y };
  });

  // Neutral line (y = 0 -> middle)
  const neutralY = padY + chartH / 2;

  return (
    <Svg width={W} height={H}>
      {/* Neutral line */}
      <Line
        x1={padX}
        y1={neutralY}
        x2={W - padX}
        y2={neutralY}
        stroke="#E5E7EB"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      {/* Line segments */}
      {points.map((p, idx) => {
        if (idx === 0) return null;
        const prev = points[idx - 1];
        return (
          <Line
            key={idx}
            x1={prev.x}
            y1={prev.y}
            x2={p.x}
            y2={p.y}
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      })}
      {/* Dots */}
      {points.map((p, idx) => (
        <Circle
          key={`dot-${idx}`}
          cx={p.x}
          cy={p.y}
          r={4}
          fill={color}
        />
      ))}
    </Svg>
  );
}

export function EmotionTab({ startDate, endDate }: EmotionTabProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const diaryEntries = useAppStore((s) => s.diaryEntries);

  const stats = useMemo(() => {
    const dates = getDatesBetween(startDate, endDate);
    const entries = diaryEntries.filter((e) => dates.includes(e.date));

    // Average mood score
    const avgMood =
      entries.length > 0
        ? entries.reduce((sum, e) => sum + e.moodScore, 0) / entries.length
        : 0;

    // Mood trend data
    const moodTrend = entries
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({ date: e.date, score: e.moodScore }));

    // Emotion frequency
    const emotionCount: Record<string, number> = {};
    entries.forEach((e) => {
      e.emotionTags.forEach((tag) => {
        emotionCount[tag] = (emotionCount[tag] || 0) + 1;
      });
    });

    const totalTags = Object.values(emotionCount).reduce((a, b) => a + b, 0);

    const emotionStats = Object.entries(emotionCount)
      .map(([type, count]) => ({
        type: type as EmotionType,
        count,
        ratio: totalTags > 0 ? count / totalTags : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      avgMood,
      moodTrend,
      emotionStats,
      entryCount: entries.length,
      totalDays: dates.length,
    };
  }, [diaryEntries, startDate, endDate]);

  const getMoodEmoji = (score: number) => {
    if (score >= 0.6) return '😊';
    if (score >= 0.2) return '🙂';
    if (score >= -0.2) return '😐';
    if (score >= -0.6) return '😔';
    return '😢';
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Average Mood Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.cardBackgroundColor },
        ]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
          평균 기분 점수
        </Text>
        <View style={styles.avgMoodRow}>
          <Text style={styles.avgMoodEmoji}>
            {getMoodEmoji(stats.avgMood)}
          </Text>
          <View>
            <Text style={[styles.avgMoodScore, { color: theme.primaryColor }]}>
              {stats.avgMood >= 0 ? '+' : ''}
              {stats.avgMood.toFixed(2)}
            </Text>
            <Text style={[styles.avgMoodLabel, { color: theme.textSecondary }]}>
              {stats.entryCount}일 / {stats.totalDays}일 기록
            </Text>
          </View>
        </View>
      </View>

      {/* Mood Trend Chart */}
      {stats.moodTrend.length > 1 && (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackgroundColor },
          ]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            기분 변화 추이
          </Text>
          <View style={styles.chartContainer}>
            <MoodLineChart data={stats.moodTrend} color={theme.primaryColor} />
          </View>
          <View style={styles.chartLabelRow}>
            <Text style={[styles.chartLabel, { color: theme.textSecondary }]}>
              😢 힘든 날
            </Text>
            <Text style={[styles.chartLabel, { color: theme.textSecondary }]}>
              😊 좋은 날
            </Text>
          </View>
        </View>
      )}

      {/* Emotion Distribution */}
      {stats.emotionStats.length > 0 && (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackgroundColor },
          ]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            감정 분포
          </Text>
          {stats.emotionStats.map(({ type, count, ratio }) => {
            const color =
              EMOTION_COLORS[type] || theme.primaryColor;
            const label =
              EMOTION_LABELS[type] || type;
            const emotionInfo = EMOTIONS.find((e) => e.type === type);
            return (
              <View key={type} style={styles.emotionRow}>
                <Text style={styles.emotionEmoji}>
                  {emotionInfo?.emoji || '❓'}
                </Text>
                <Text
                  style={[styles.emotionLabel, { color: theme.textPrimary }]}>
                  {label}
                </Text>
                <View style={styles.emotionBarBg}>
                  <View
                    style={[
                      styles.emotionBarFill,
                      {
                        backgroundColor: color,
                        width: `${Math.round(ratio * 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.emotionCount,
                    { color: theme.textSecondary },
                  ]}>
                  {count}회
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Empty state */}
      {stats.entryCount === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            이 기간에 작성된 일기가 없어요
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  avgMoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avgMoodEmoji: {
    fontSize: 48,
  },
  avgMoodScore: {
    fontSize: 28,
    fontWeight: '700',
  },
  avgMoodLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  chartLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 11,
  },
  emotionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  emotionEmoji: {
    fontSize: 20,
  },
  emotionLabel: {
    width: 40,
    fontSize: 13,
    fontWeight: '600',
  },
  emotionBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  emotionBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  emotionCount: {
    width: 36,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  satRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  satItem: {
    alignItems: 'center',
    gap: 4,
  },
  satEmoji: {
    fontSize: 32,
  },
  satValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  satLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
  },
});
