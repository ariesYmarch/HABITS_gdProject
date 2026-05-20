import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { SatisfactionTrend, getSatisfactionTrend } from '../../services/feedback';

const RATING_COLOR = {
  good: '#34C759',
  neutral: '#FFC107',
  bad: '#EF4444',
};

const RATING_LABEL = {
  good: '좋아요',
  neutral: '보통',
  bad: '아쉬워요',
};

interface Props {
  refreshKey?: number;  // 외부에서 평가 후 갱신 트리거용
}

export function SatisfactionTrendCard({ refreshKey }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  const [data, setData] = useState<SatisfactionTrend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getSatisfactionTrend(90)
      .then((r) => { if (alive) setData(r); })
      .catch(() => { if (alive) setData(null); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [refreshKey]);

  if (loading) {
    return (
      <View style={[s.card, s.center]}>
        <ActivityIndicator size="small" color={theme.primaryColor} />
      </View>
    );
  }

  if (!data || data.count === 0) {
    return null;  // 평가 없으면 카드 자체 숨김
  }

  // 최근 10개만 시각화 (오른쪽이 최신)
  const recent = data.points.slice(-10);
  const counts = { good: 0, neutral: 0, bad: 0 };
  for (const p of data.points) counts[p.rating] += 1;

  // 평균 -1~1 → 0~100% 변환
  const avgPct = Math.round((data.avg_score + 1) * 50);

  return (
    <View style={s.card}>
      <View style={s.header}>
        <Text style={[s.title, { color: theme.textPrimary }]}>리포트 만족도 추이</Text>
        <Text style={[s.avg, { color: theme.primaryColor }]}>{avgPct}점</Text>
      </View>

      {/* 점 그래프 (최근 10개) */}
      <View style={s.dotRow}>
        {recent.map((p) => (
          <View key={p.id} style={s.dotCol}>
            <View
              style={[
                s.dot,
                {
                  backgroundColor: RATING_COLOR[p.rating],
                  // bad는 아래, good는 위, neutral는 가운데
                  marginTop: p.rating === 'good' ? 0 : p.rating === 'neutral' ? 12 : 24,
                },
              ]}
            />
          </View>
        ))}
      </View>

      {/* 분포 요약 */}
      <View style={s.summary}>
        {(['good', 'neutral', 'bad'] as const).map((r) => (
          <View key={r} style={s.sumItem}>
            <View style={[s.sumDot, { backgroundColor: RATING_COLOR[r] }]} />
            <Text style={[s.sumText, { color: theme.textSecondary }]}>
              {RATING_LABEL[r]} {counts[r]}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[s.hint, { color: theme.textSecondary }]}>최근 90일 / 총 {data.count}개</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  center: { minHeight: 80, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 14, fontWeight: '700' },
  avg: { fontSize: 18, fontWeight: '700' },
  dotRow: { flexDirection: 'row', height: 40, alignItems: 'flex-start', marginBottom: 10 },
  dotCol: { flex: 1, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  summary: { flexDirection: 'row', gap: 12, marginBottom: 6 },
  sumItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sumDot: { width: 8, height: 8, borderRadius: 4 },
  sumText: { fontSize: 11 },
  hint: { fontSize: 10, opacity: 0.6 },
});
