import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import type { DiaryEntry } from '../../types/diary';
import type { HabitFrequency } from '../../types/habit';
import { EMOTION_LABELS, EMOTION_EMOJIS } from '../../data/emotionKeywords';
import { EMOTIONS } from '../../types/diary';

type FeedbackPeriod = 'week' | 'month' | 'year';
type FeedbackTab = 'progress' | 'emotion' | 'diary';

const PERIODS: { key: FeedbackPeriod; label: string }[] = [
  { key: 'week', label: '이번 주' },
  { key: 'month', label: '이번 달' },
  { key: 'year', label: '올해' },
];

const TABS: { key: FeedbackTab; label: string; icon: string }[] = [
  { key: 'progress', label: '진척도', icon: '📊' },
  { key: 'emotion', label: '감정 분석', icon: '❤️' },
  { key: 'diary', label: '일기', icon: '📖' },
];

/* ─── helpers ─── */
function pad2(n: number) { return String(n).padStart(2, '0'); }
function fmtDate(d: Date) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }

function getDayOfWeek(dateString: string): number {
  const d = new Date(dateString + 'T00:00:00');
  const jsDay = d.getDay();
  return jsDay === 0 ? 6 : jsDay - 1; // 0=Mon ... 6=Sun
}

function isHabitOnDay(frequency: HabitFrequency, dayOfWeek: number): boolean {
  if (frequency === 'daily') return true;
  if (frequency === 'weekdays') return dayOfWeek < 5;
  if (frequency === 'weekends') return dayOfWeek >= 5;
  if (typeof frequency === 'object' && frequency.type === 'custom') {
    return frequency.days.includes(dayOfWeek);
  }
  return true;
}

function emotionTagToKorean(tag: string): string {
  return (EMOTION_LABELS as Record<string, string>)[tag] || tag;
}

function emotionTagToEmoji(tag: string): string {
  const info = EMOTIONS.find((e) => e.type === tag);
  return info?.emoji || (EMOTION_EMOJIS as Record<string, string>)[tag] || '';
}
function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function getWeekStart(d: Date, offset: number = 0): Date {
  let cur = startOfDay(addDays(d, offset * 7));
  while (cur.getDay() !== 1) cur = addDays(cur, -1);
  return cur;
}
function getWeekLabel(weekStart: Date): string {
  const thu = addDays(weekStart, 3);
  const month = thu.getMonth() + 1;
  const firstOfMonth = new Date(thu.getFullYear(), thu.getMonth(), 1);
  const firstMonday = addDays(firstOfMonth, (8 - firstOfMonth.getDay()) % 7 || 7);
  let weekNum: number;
  if (firstOfMonth.getDay() === 1) {
    weekNum = Math.floor((thu.getDate() - 1) / 7) + 1;
  } else {
    if (thu < firstMonday) {
      weekNum = 1;
    } else {
      weekNum = Math.floor((thu.getDate() - firstMonday.getDate()) / 7) + 2;
    }
  }
  const ordinal = ['', '첫', '둘', '셋', '넷', '다섯', '여섯'][weekNum] || `${weekNum}`;
  return `${month}월 ${ordinal}째 주`;
}
function getMoodEmoji(score: number): string {
  if (score < -0.6) return '😢';
  if (score < -0.2) return '😔';
  if (score < 0.2) return '😐';
  if (score < 0.6) return '🙂';
  return '😊';
}
function formatDateKR(d: Date): string {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdays[d.getDay()]})`;
}

export function FeedbackSummaryScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const softGradient: [string, string] = [theme.gradientColors[1], theme.gradientColors[2]];
  const habits = useAppStore((s) => s.habits);
  const diaryEntries = useAppStore((s) => s.diaryEntries);
  const selectedHashtags = useAppStore((s) => s.selectedHashtags);
  const removeDiaryEntry = useAppStore((s) => s.removeDiaryEntry);

  const [selectedPeriod, setSelectedPeriod] = useState<FeedbackPeriod>('week');
  const [selectedTab, setSelectedTab] = useState<FeedbackTab>('progress');
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  /* ─── period computations ─── */
  const getDiariesForPeriod = useCallback((): DiaryEntry[] => {
    const today = startOfDay(new Date());
    let startDate: Date, endDate: Date;

    if (selectedPeriod === 'week') {
      startDate = getWeekStart(new Date(), weekOffset);
      endDate = addDays(startDate, 6);
    } else if (selectedPeriod === 'month') {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
      startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      endDate = lastDay;
    } else {
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = today;
    }

    return diaryEntries.filter((d) => {
      const dd = new Date(d.date + 'T00:00:00');
      return dd >= startDate && dd <= endDate;
    });
  }, [selectedPeriod, weekOffset, monthOffset, diaryEntries]);

  const calculateCompletionRate = useCallback((): number => {
    const today = startOfDay(new Date());
    let startDate: Date, endDate: Date;

    if (selectedPeriod === 'week') {
      startDate = getWeekStart(new Date(), weekOffset);
      endDate = addDays(startDate, 6);
    } else if (selectedPeriod === 'month') {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
      startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      endDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    } else {
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = today;
    }

    let total = 0, completed = 0;
    let d = new Date(startDate);
    while (d <= endDate) {
      const ds = fmtDate(d);
      const dow = getDayOfWeek(ds);
      habits.forEach((h) => {
        if (h.isActive && isHabitOnDay(h.frequency, dow)) {
          total++;
          if (h.completionHistory[ds]) completed++;
        }
      });
      d = addDays(d, 1);
    }
    return total > 0 ? completed / total : 0;
  }, [selectedPeriod, weekOffset, monthOffset, habits]);

  const diaries = useMemo(() => getDiariesForPeriod(), [getDiariesForPeriod]);
  const completionRate = useMemo(() => calculateCompletionRate(), [calculateCompletionRate]);

  const canNavigateNext = () => {
    if (selectedPeriod === 'week') return weekOffset < 0;
    if (selectedPeriod === 'month') return monthOffset < 0;
    return false;
  };

  const navigatePrev = () => {
    if (selectedPeriod === 'week') setWeekOffset((p) => p - 1);
    else setMonthOffset((p) => p - 1);
  };
  const navigateNext = () => {
    if (selectedPeriod === 'week') setWeekOffset((p) => p + 1);
    else setMonthOffset((p) => p + 1);
  };

  const getPeriodLabel = (): string => {
    if (selectedPeriod === 'week') {
      const ws = getWeekStart(new Date(), weekOffset);
      return getWeekLabel(ws);
    }
    const monthDate = new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset, 1);
    return `${monthDate.getFullYear()}년 ${monthDate.getMonth() + 1}월`;
  };

  /* ─── graph data ─── */
  const getDisplayData = (): { label: string; score: number | null }[] => {
    const sorted = [...diaries].sort((a, b) => a.date.localeCompare(b.date));

    if (selectedPeriod === 'week') {
      const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
      const ws = getWeekStart(new Date(), weekOffset);
      return Array.from({ length: 7 }, (_, i) => {
        const date = addDays(ws, i);
        const ds = fmtDate(date);
        const dayEntries = sorted.filter((d) => d.date === ds);
        const avg = dayEntries.length > 0
          ? dayEntries.reduce((sum, d) => sum + d.moodScore, 0) / dayEntries.length
          : null;
        return { label: weekDays[i], score: avg };
      });
    }
    if (selectedPeriod === 'month') {
      const monthDate = new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset, 1);
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      const today = new Date();
      const isCurrentMonth = monthDate.getMonth() === today.getMonth() && monthDate.getFullYear() === today.getFullYear();
      const lastDay = isCurrentMonth ? today.getDate() : daysInMonth;
      return Array.from({ length: lastDay }, (_, i) => {
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), i + 1);
        const ds = fmtDate(date);
        const dayEntries = sorted.filter((d) => d.date === ds);
        const avg = dayEntries.length > 0
          ? dayEntries.reduce((sum, d) => sum + d.moodScore, 0) / dayEntries.length
          : null;
        return { label: `${i + 1}`, score: avg };
      });
    }
    // year
    const year = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    return Array.from({ length: currentMonth }, (_, i) => {
      const monthDiaries = sorted.filter((d) => {
        const dd = new Date(d.date + 'T00:00:00');
        return dd.getMonth() === i && dd.getFullYear() === year;
      });
      const avg = monthDiaries.length > 0
        ? monthDiaries.reduce((sum, d) => sum + d.moodScore, 0) / monthDiaries.length
        : null;
      return { label: `${i + 1}월`, score: avg };
    });
  };

  /* ─── AI insights ─── */
  const getInsightMessage = (): string => {
    const rate = completionRate;
    if (rate >= 0.8) return '정말 훌륭해요! 습관이 잘 자리잡고 있어요 🎉';
    if (rate >= 0.6) return '꾸준히 노력하고 계시네요. 조금만 더!';
    if (rate >= 0.4) return '절반 정도 달성했어요. 빈도를 조정해볼까요?';
    return '작은 것부터 시작해보세요! 💪';
  };

  /* ─── emotion analysis ─── */
  const getEmotionFeedback = (): string => {
    if (diaries.length === 0) {
      return '아직 기록된 일기가 부족해요. 매일 감정을 기록하면 더 정확한 분석을 받을 수 있어요! ✍️';
    }
    const scores = diaries.map((d) => d.moodScore);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const periodLabel = selectedPeriod === 'week' ? '이번 주' : selectedPeriod === 'month' ? '이번 달' : '올해';

    let feedback = '';
    if (avg > 0.3) feedback += `${periodLabel} 전반적으로 긍정적인 감정 상태를 유지하셨네요. `;
    else if (avg < -0.3) feedback += `${periodLabel} 다소 힘든 시간을 보내신 것 같아요. `;
    else feedback += `${periodLabel} 감정이 비교적 안정적이었어요. `;

    const tagCounts: Record<string, number> = {};
    diaries.forEach((d) => d.emotionTags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
    const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    if (sorted.length >= 2) feedback += `'${emotionTagToKorean(sorted[0][0])}'과 '${emotionTagToKorean(sorted[1][0])}' 감정이 주를 이뤘네요. `;
    else if (sorted.length === 1) feedback += `'${emotionTagToKorean(sorted[0][0])}' 감정을 주로 느끼셨어요. `;

    const rate = completionRate;
    if (rate >= 0.7 && avg > 0) feedback += '이 좋은 흐름을 유지해보세요 🌟';
    else if (rate >= 0.7) feedback += '충분한 휴식도 중요해요 💙';
    else if (rate < 0.5 && avg < 0) feedback += '작은 습관부터 천천히 시작해보는 건 어떨까요? 💪';
    else feedback += '꾸준한 습관 실천과 감정 기록으로 더 나은 하루를 만들어가요! ✨';

    return feedback;
  };

  /* ─── hashtag progress ─── */
  const getHashtagProgress = () => {
    const today = startOfDay(new Date());
    let startDate: Date, endDate: Date;

    if (selectedPeriod === 'week') {
      startDate = getWeekStart(new Date(), weekOffset);
      endDate = addDays(startDate, 6);
    } else if (selectedPeriod === 'month') {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
      startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      endDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    } else {
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = today;
    }

    // selectedHashtags(사용자 선택 목표) + 활성 습관에 실제 붙어있는 모든 태그를 합집합으로 표시
    // → 사용자가 선택하지 않은 추천 습관의 태그도 누락 없이 추적되어 이행률 표시
    const tagSet = new Set<string>(selectedHashtags);
    habits.forEach((h) => {
      if (!h.isActive) return;
      (h.hashtags || []).forEach((t) => tagSet.add(t));
    });

    return Array.from(tagSet)
      .map((tag) => {
        const tagHabits = habits.filter(
          (h) => h.isActive && (h.hashtags || []).includes(tag),
        );
        if (tagHabits.length === 0) {
          return { tag, rate: 0, hasHabits: false };
        }
        let total = 0, completed = 0;
        let d = new Date(startDate);
        while (d <= endDate) {
          const ds = fmtDate(d);
          const dow = getDayOfWeek(ds);
          tagHabits.forEach((h) => {
            if (isHabitOnDay(h.frequency, dow)) {
              total++;
              if (h.completionHistory[ds]) completed++;
            }
          });
          d = addDays(d, 1);
        }
        return { tag, rate: total > 0 ? completed / total : 0, hasHabits: true };
      })
      .filter((item) => item.hasHabits)   // 매칭 습관 없는 태그는 숨김
      .sort((a, b) => b.rate - a.rate);
  };

  const handleDeleteDiary = (entry: DiaryEntry) => {
    Alert.alert('일기를 삭제할까요?', '', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => removeDiaryEntry?.(entry.id),
      },
    ]);
  };

  /* ─── render progress tab ─── */
  const renderProgressTab = () => {
    const rate = completionRate;
    const circumference = 2 * Math.PI * 36;
    const strokeDashoffset = circumference * (1 - rate);

    return (
      <>
        {/* Overall Completion Card */}
        <View style={st.card}>
          <View style={st.completionRow}>
            <View style={{ flex: 1 }}>
              <Text style={[st.completionLabel, { color: theme.textSecondary }]}>
                {PERIODS.find((p) => p.key === selectedPeriod)?.label} 습관 달성률
              </Text>
              <Text style={[st.completionPercent, { color: theme.primaryColor }]}>
                {Math.round(rate * 100)}%
              </Text>
            </View>
            <View style={st.circleContainer}>
              <Svg width={80} height={80}>
                <SvgCircle cx={40} cy={40} r={36} stroke="#E5E7EB" strokeWidth={8} fill="none" />
                <SvgCircle
                  cx={40} cy={40} r={36}
                  stroke={theme.primaryColor}
                  strokeWidth={8}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 40 40)"
                />
              </Svg>
              <Text style={st.circleEmoji}>{rate >= 0.7 ? '🎉' : '💪'}</Text>
            </View>
          </View>
        </View>

        {/* Hashtag Progress */}
        <View style={st.card}>
          <Text style={[st.cardTitle, { color: theme.textPrimary }]}>목표별 진척도</Text>
          {(() => {
            const progress = getHashtagProgress();
            if (progress.length === 0) {
              return (
                <Text style={[st.emptyText, { color: theme.textSecondary }]}>
                  해시태그가 있는 습관이 없어요
                </Text>
              );
            }
            return progress.map(({ tag, rate: r }) => (
              <View key={tag} style={st.progressItem}>
                <View style={st.progressLabelRow}>
                  <Text style={[st.progressTag, { color: theme.textPrimary }]}>{tag}</Text>
                  <Text style={[st.progressPercent, { color: theme.textSecondary }]}>{Math.round(r * 100)}%</Text>
                </View>
                <View style={st.progressBarBg}>
                  <LinearGradient
                    colors={softGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[st.progressBarFill, { width: `${Math.max(2, Math.round(r * 100))}%` as any }]}
                  />
                </View>
              </View>
            ));
          })()}
        </View>

        {/* AI Insight */}
        <View style={[st.insightCard, { backgroundColor: theme.primaryColor + '1A' }]}>
          <View style={st.insightHeader}>
            <Text style={{ color: theme.primaryColor, fontSize: 16 }}>✨</Text>
            <Text style={[st.insightTitle, { color: theme.textPrimary }]}>인사이트</Text>
          </View>
          <Text style={[st.insightText, { color: theme.textSecondary }]}>{getInsightMessage()}</Text>
        </View>
      </>
    );
  };

  /* ─── render emotion tab ─── */
  const renderEmotionTab = () => {
    const displayData = getDisplayData();
    const validScores = displayData.filter((d) => d.score !== null).map((d) => d.score as number);
    // Stats from all individual diary entries (not per-day averages)
    const allScores = diaries.map((d) => d.moodScore);
    const hasData = allScores.length > 0;
    const avgScore = hasData ? allScores.reduce((a, b) => a + b, 0) / allScores.length : null;
    const maxScore = hasData ? Math.max(...allScores) : null;
    const minScore = hasData ? Math.min(...allScores) : null;

    const barWidth = displayData.length <= 7 ? 28 : displayData.length <= 14 ? 16 : 8;
    const barSpacing = displayData.length <= 7 ? 8 : displayData.length <= 14 ? 4 : 2;

    return (
      <>
        {/* Mood Graph */}
        <View style={st.card}>
          <Text style={[st.cardTitle, { color: theme.textPrimary }]}>
            {selectedPeriod === 'week' ? '주간' : selectedPeriod === 'month' ? '월간' : '올해'} 기분 변화
          </Text>
          {validScores.length === 0 ? (
            <View style={st.emptyGraph}>
              <Text style={st.emptyGraphEmoji}>📝</Text>
              <Text style={[st.emptyText, { color: theme.textSecondary }]}>
                {PERIODS.find((p) => p.key === selectedPeriod)?.label} 기록된 일기가 없어요
              </Text>
            </View>
          ) : (
            <View style={st.graphContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[st.barsRow, { gap: barSpacing }]}>
                  {displayData.map((data, idx) => {
                    const height = data.score !== null ? Math.max(10, ((data.score + 1) / 2) * 80) : 10;
                    const showLabel = displayData.length <= 7 || (displayData.length <= 14 ? idx % 2 === 0 : idx % 5 === 0 || idx === displayData.length - 1);
                    return (
                      <View key={idx} style={st.barColumn}>
                        {data.score !== null ? (
                          <LinearGradient
                            colors={softGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={{ width: barWidth, height, borderRadius: 2 }}
                          />
                        ) : (
                          <View style={{ width: barWidth, height: 10, borderRadius: 2, backgroundColor: '#E5E7EB' }} />
                        )}
                        {showLabel && (
                          <Text style={st.barLabel}>{data.label}</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        {/* Emotion Stats */}
        <View style={st.card}>
          <View style={st.statsRow}>
            <View style={st.statItem}>
              <Text style={[st.statLabel, { color: theme.textSecondary }]}>평균</Text>
              <Text style={avgScore !== null ? st.statEmoji : st.statDash}>{avgScore !== null ? getMoodEmoji(avgScore) : '–'}</Text>
              <Text style={[st.statScore, { color: theme.primaryColor }]}>{avgScore !== null ? `${Math.round((avgScore + 1) / 2 * 100)}점` : '없음'}</Text>
            </View>
            <View style={st.statDivider} />
            <View style={st.statItem}>
              <Text style={[st.statLabel, { color: theme.textSecondary }]}>최고</Text>
              <Text style={maxScore !== null ? st.statEmoji : st.statDash}>{maxScore !== null ? getMoodEmoji(maxScore) : '–'}</Text>
              <Text style={[st.statScore, { color: '#34C759' }]}>{maxScore !== null ? `${Math.round((maxScore + 1) / 2 * 100)}점` : '없음'}</Text>
            </View>
            <View style={st.statDivider} />
            <View style={st.statItem}>
              <Text style={[st.statLabel, { color: theme.textSecondary }]}>최저</Text>
              <Text style={minScore !== null ? st.statEmoji : st.statDash}>{minScore !== null ? getMoodEmoji(minScore) : '–'}</Text>
              <Text style={[st.statScore, { color: '#FF9500' }]}>{minScore !== null ? `${Math.round((minScore + 1) / 2 * 100)}점` : '없음'}</Text>
            </View>
          </View>
        </View>

        {/* AI Emotion Feedback */}
        <View style={[st.insightCard, { backgroundColor: theme.primaryColor + '1A' }]}>
          <View style={st.insightHeader}>
            <Text style={{ color: theme.primaryColor, fontSize: 16 }}>🧠</Text>
            <Text style={[st.insightTitle, { color: theme.textPrimary }]}>감정 분석</Text>
          </View>
          <Text style={[st.insightText, { color: theme.textSecondary, lineHeight: 22 }]}>{getEmotionFeedback()}</Text>
        </View>

      </>
    );
  };

  /* ─── render diary tab ─── */
  const renderDiaryTab = () => {
    const sorted = [...diaries].sort((a, b) => b.date.localeCompare(a.date));
    return (
      <>
        <Text style={[st.diaryHeader, { color: theme.textPrimary }]}>
          {PERIODS.find((p) => p.key === selectedPeriod)?.label} 일기 ({sorted.length}개)
        </Text>
        {sorted.length === 0 ? (
          <View style={[st.card, st.emptyDiary]}>
            <Text style={{ fontSize: 50 }}>📝</Text>
            <Text style={[st.emptyText, { color: theme.textSecondary }]}>작성한 일기가 없어요</Text>
          </View>
        ) : (
          sorted.map((diary) => {
            const d = new Date(diary.date + 'T00:00:00');
            return (
              <View key={diary.id} style={st.diaryCard}>
                <View style={st.diaryCardHeader}>
                  <Text style={[st.diaryDate, { color: theme.textPrimary }]}>{formatDateKR(d)}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 26 }}>{getMoodEmoji(diary.moodScore)}</Text>
                    <TouchableOpacity onPress={() => handleDeleteDiary(diary)}>
                      <Text style={{ fontSize: 12, color: '#EF444499' }}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* 사용자 선택 감정 (primary color, 채워진 배경) */}
                {diary.emotionTags.length > 0 && (
                  <View style={st.diaryTags}>
                    <Text style={[st.diaryTagsLabel, { color: theme.textSecondary }]}>내가 선택한 감정</Text>
                    <View style={st.diaryTagWrap}>
                      {diary.emotionTags.slice(0, 4).map((tag) => (
                        <View key={tag} style={[st.diaryTag, { backgroundColor: theme.primaryColor + '1A' }]}>
                          <Text style={[st.diaryTagText, { color: theme.primaryColor }]}>{emotionTagToEmoji(tag)} {emotionTagToKorean(tag)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                {/* AI 분석 감정 (회색 outline, 다른 스타일로 구분) */}
                {diary.emotionAnalysis && diary.emotionAnalysis.distribution && (
                  <View style={st.diaryTags}>
                    <Text style={[st.diaryTagsLabel, { color: theme.textSecondary }]}>🤖 AI 감정 분석</Text>
                    <View style={st.diaryTagWrap}>
                      {Object.entries(diary.emotionAnalysis.distribution as Record<string, number>)
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .slice(0, 3)
                        .map(([emo, score]) => (
                          <View key={emo} style={[st.diaryAnalysisTag]}>
                            <Text style={[st.diaryAnalysisTagText, { color: theme.textSecondary }]}>
                              {emotionTagToEmoji(emo) || '·'} {emotionTagToKorean(emo) || emo} {Math.round((score as number) * 100)}%
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                )}
                {diary.textContent && (
                  <Text style={[st.diaryText, { color: theme.textSecondary }]} numberOfLines={2}>
                    {diary.textContent}
                  </Text>
                )}
              </View>
            );
          })
        )}
      </>
    );
  };

  return (
    <View style={[st.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <View style={st.container}>
        {/* Period Selector */}
        <View style={st.periodSelectorContainer}>
          <View style={[st.periodSelector, { backgroundColor: theme.primaryColor + '1A' }]}>
            {PERIODS.map((period) => {
              const active = selectedPeriod === period.key;
              return (
                <TouchableOpacity key={period.key} activeOpacity={0.8} onPress={() => { setSelectedPeriod(period.key); setWeekOffset(0); setMonthOffset(0); }}>
                  <View style={[st.periodButton, active && st.periodButtonActive]}>
                    {active && <LinearGradient colors={softGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />}
                    <Text style={active ? st.periodActiveText : [st.periodInactiveText, { color: theme.primaryColor }]}>{period.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Period Navigation */}
        {(selectedPeriod === 'week' || selectedPeriod === 'month') && (
          <View style={st.periodNavRow}>
            <TouchableOpacity onPress={navigatePrev}>
              <Text style={[st.periodNavArrow, { color: theme.primaryColor }]}>‹</Text>
            </TouchableOpacity>
            <Text style={[st.periodNavLabel, { color: theme.textPrimary }]}>{getPeriodLabel()}</Text>
            <TouchableOpacity onPress={navigateNext} disabled={!canNavigateNext()}>
              <Text style={[st.periodNavArrow, { color: canNavigateNext() ? theme.primaryColor : '#D1D5DB' }]}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tab Selector */}
        <View style={st.tabSelector}>
          {TABS.map((tab) => {
            const active = selectedTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  st.tabButton,
                  active && { backgroundColor: theme.primaryColor, borderRadius: 12 },
                ]}
                onPress={() => setSelectedTab(tab.key)}
                activeOpacity={0.7}>
                <Text style={{ fontSize: 12 }}>{tab.icon}</Text>
                <Text
                  style={[
                    st.tabText,
                    {
                      color: active ? '#FFFFFF' : theme.textSecondary,
                      fontWeight: active ? '600' : '400',
                    },
                  ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[st.scrollContent, { paddingBottom: insets.bottom + 30 }]}
          showsVerticalScrollIndicator={false}>
          {selectedTab === 'progress' && renderProgressTab()}
          {selectedTab === 'emotion' && renderEmotionTab()}
          {selectedTab === 'diary' && renderDiaryTab()}
        </ScrollView>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  periodSelectorContainer: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  periodSelector: { flexDirection: 'row', borderRadius: 20, padding: 4 },
  periodButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16, overflow: 'hidden' as const },
  periodButtonActive: { overflow: 'hidden' as const },
  periodActiveText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  periodInactiveText: { fontSize: 15 },
  tabSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  tabText: { fontSize: 15 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: { fontSize: 17, fontWeight: '600', marginBottom: 16 },
  completionRow: { flexDirection: 'row', alignItems: 'center' },
  completionLabel: { fontSize: 14, marginBottom: 4 },
  completionPercent: { fontSize: 48, fontWeight: '700' },
  circleContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  circleEmoji: { position: 'absolute', fontSize: 26 },
  emptyText: { fontSize: 15, textAlign: 'center', paddingVertical: 20 },
  progressItem: { marginBottom: 16 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressTag: { fontSize: 14, fontWeight: '500' },
  progressPercent: { fontSize: 14 },
  progressBarBg: { height: 8, backgroundColor: '#E5E7EB33', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: 8 },
  insightCard: { borderRadius: 20, padding: 20 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  insightTitle: { fontSize: 17, fontWeight: '600' },
  insightText: { fontSize: 14, lineHeight: 20 },
  periodNavRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 4 },
  periodNavArrow: { fontSize: 28, fontWeight: '300' },
  periodNavLabel: { fontSize: 17, fontWeight: '600' },
  graphContainer: { height: 120, justifyContent: 'flex-end' },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', height: 100 },
  barColumn: { alignItems: 'center' },
  barLabel: { fontSize: 8, color: '#9CA3AF', marginTop: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', gap: 6 },
  statLabel: { fontSize: 12 },
  statEmoji: { fontSize: 26 },
  statDash: { fontSize: 16, color: '#D1D5DB', fontWeight: '300' },
  statScore: { fontSize: 14, fontWeight: '600' },
  statDivider: { width: 1, height: 50, backgroundColor: '#E5E7EB' },
  diaryHeader: { fontSize: 17, fontWeight: '600' },
  emptyDiary: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyGraph: { alignItems: 'center', paddingVertical: 30, gap: 12 },
  emptyGraphEmoji: { fontSize: 40 },
  diaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  diaryCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  diaryDate: { fontSize: 14, fontWeight: '500' },
  diaryTags: { marginTop: 10 },
  diaryTagsLabel: { fontSize: 11, marginBottom: 4 },
  diaryTagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  diaryTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  diaryTagText: { fontSize: 12, fontWeight: '600' },
  diaryAnalysisTag: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    backgroundColor: 'transparent', borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed',
  },
  diaryAnalysisTagText: { fontSize: 11 },
  diaryText: { fontSize: 14, marginTop: 8, lineHeight: 20 },
});
