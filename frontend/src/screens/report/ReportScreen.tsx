import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  RefreshControl, ActivityIndicator, Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Lightbulb, FileText, Sparkles, Plus, TrendingDown, Coffee,
  Sunrise, Train, Utensils, Sun, Sunset, Moon, Clock,
} from 'lucide-react-native';
import { showAlert } from '../../components/common/AppAlert';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import {
  ReportItem, listReports, generateReportNow, rateFeedback, deleteReport, markReportRead,
} from '../../services/reports';
import { EMOTIONS } from '../../types/diary';
import { GraduationCandidate, listGraduationCandidates, graduateHabit } from '../../services/habits';
import { FeedbackResponse, getWeeklyFeedback } from '../../services/feedback';
import { HabitEditModal } from '../../components/habit/HabitEditModal';
import type { Habit, HabitFrequency, TimeSlot } from '../../types/habit';
import { pushSync } from '../../services/sync';
import { findPersonalityType } from '../../data/personalityTypes';
import { recommendTemplates } from '../../data/habitTemplates';
import type { HabitTemplateItem } from '../../types/habit';

type Tab = 'week' | 'month';
type Rating = 'good' | 'neutral' | 'bad';

const RATING_LABELS: Record<Rating, string> = {
  good: '좋아요',
  neutral: '보통',
  bad: '아쉬워요',
};

const RATING_EMOJIS: Record<Rating, string> = {
  good: '😊',
  neutral: '😐',
  bad: '😕',
};

// 'YYYY-MM-DD' 두 개를 받아 'M월 D일 ~ M월 D일'로 변환
function formatPeriodKR(start: string, end: string): string {
  const fmt = (iso: string) => {
    const parts = iso.split('-');
    if (parts.length < 3) return iso;
    return `${parseInt(parts[1], 10)}월 ${parseInt(parts[2], 10)}일`;
  };
  return `${fmt(start)} ~ ${fmt(end)}`;
}

const ORDINALS = ['', '첫', '둘', '셋', '넷', '다섯', '여섯'];

// 주간/월간을 직관 라벨로
// week → "5월 둘째 주" (period_start의 목요일 기준)
// month → "5월"
function formatPeriodIntuitive(periodType: 'week' | 'month', start: string): string {
  const parts = start.split('-');
  if (parts.length < 3) return start;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  if (periodType === 'month') {
    return `${m}월`;
  }

  // 주간: period_start는 월요일. 그 주의 목요일 기준 N째주
  const monday = new Date(y, m - 1, d);
  const thu = new Date(monday);
  thu.setDate(thu.getDate() + 3);
  const thuMonth = thu.getMonth() + 1;
  // 목요일 기준 그 달 첫 월요일과 비교해 N째주
  const firstOfMonth = new Date(thu.getFullYear(), thu.getMonth(), 1);
  const firstMondayOffset = (8 - firstOfMonth.getDay()) % 7;
  const firstMonday = new Date(firstOfMonth);
  firstMonday.setDate(firstMonday.getDate() + firstMondayOffset);
  let weekNum: number;
  if (firstOfMonth.getDay() === 1) {
    weekNum = Math.floor((thu.getDate() - 1) / 7) + 1;
  } else if (thu < firstMonday) {
    weekNum = 1;
  } else {
    weekNum = Math.floor((thu.getDate() - firstMonday.getDate()) / 7) + 2;
  }
  const ord = ORDINALS[weekNum] || `${weekNum}`;
  return `${thuMonth}월 ${ord}째 주`;
}

export function ReportScreen() {
  const insets = useSafeAreaInsets();
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  const [tab, setTab] = useState<Tab>('week');
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [graduations, setGraduations] = useState<GraduationCandidate[]>([]);
  const [weekly, setWeekly] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selected, setSelected] = useState<ReportItem | null>(null);

  const load = useCallback(async () => {
    try {
      const [data, grad, wk] = await Promise.all([
        listReports(tab),
        listGraduationCandidates().catch(() => []),
        getWeeklyFeedback().catch(() => null),
      ]);
      setReports(data);
      setGraduations(grad);
      setWeekly(wk);
    } catch (e: any) {
      console.warn('[reports] load 실패', e?.message || e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    // 로컬 변경분을 먼저 push해 백엔드가 최신 상태에서 리포트 데이터를 반환하도록
    await pushSync().catch(() => {});
    await load();
  };

  const runGenerate = async (force: boolean) => {
    setGenerating(true);
    try {
      await pushSync().catch(() => {});
      const result = await generateReportNow(tab, force);
      if (result.created) {
        await load();
      } else {
        const msg = result.reason || '데이터가 부족하거나 이미 리포트가 존재해요.';
        const canRegenerate = msg.includes('이미 존재');
        showAlert({
          title: '리포트를 만들지 못했어요',
          message: msg,
          actions: canRegenerate
            ? [
                { label: '취소' },
                { label: '재생성', primary: true, onPress: () => runGenerate(true) },
              ]
            : [{ label: '확인', primary: true }],
        });
      }
    } catch (e: any) {
      showAlert({
        title: '잠시 문제가 생겼어요',
        message: e?.response?.data?.detail || '리포트 생성 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateNow = () => runGenerate(false);

  const handleGraduate = async (c: GraduationCandidate) => {
    showAlert({
      title: '습관 졸업',
      message: `'${c.habit_title}'을(를) 졸업 처리할까요?\n\n${c.message}`,
      actions: [
        { label: '취소' },
        {
          label: '졸업하기', primary: true, onPress: async () => {
            try {
              await graduateHabit(c.habit_id);
              await load();
              showAlert({ title: '완료', message: '축하합니다! 새로운 습관에 도전해보세요.' });
            } catch (e: any) {
              showAlert({ title: '오류', message: e?.response?.data?.detail || '졸업 처리 실패' });
            }
          },
        },
      ],
    });
  };

  const [badRatingTarget, setBadRatingTarget] = useState<ReportItem | null>(null);

  const submitRate = async (
    target: ReportItem,
    rating: Rating,
    comment?: string,
  ) => {
    try {
      await rateFeedback(
        tab === 'week' ? 'weekly' : 'monthly',
        target.period_start,
        target.period_end,
        rating,
        (target.model_used as 'static' | 'gemini') || 'static',
        comment,
      );
      showAlert({ title: '감사합니다', message: '피드백이 저장되었어요. 다음 리포트에 반영할게요.' });
      setSelected(null);
      setBadRatingTarget(null);
    } catch (e: any) {
      showAlert({ title: '오류', message: '평가 저장에 실패했어요.' });
    }
  };

  const handleRate = (rating: Rating) => {
    if (!selected) return;
    if (rating === 'bad') {
      // 아쉬워요: 사유 수집 팝업 띄움
      setBadRatingTarget(selected);
      return;
    }
    submitRate(selected, rating);
  };

  const handleDeleteReport = (r: ReportItem) => {
    showAlert({
      title: '리포트 삭제',
      message: `${r.period_start} ~ ${r.period_end} 리포트를 삭제할까요?\n복구할 수 없어요.`,
      actions: [
        { label: '취소' },
        {
          label: '삭제',
          destructive: true,
          onPress: async () => {
            try {
              await deleteReport(r.id);
              setSelected(null);
              await load();
            } catch (e: any) {
              showAlert({ title: '오류', message: '삭제에 실패했어요.' });
            }
          },
        },
      ],
    });
  };

  return (
    <View style={[s.container, { backgroundColor: theme.backgroundColor }]}>
      {/* 내부 페이지 헤더 제거 — Stack.Navigator 헤더가 '피드백 리포트' 표시 */}
      <View style={s.tabRow}>
        {(['week', 'month'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => { setTab(t); setLoading(true); }}
            style={[s.tab, tab === t && { backgroundColor: theme.primaryColor + '1A' }]}
          >
            <Text style={[s.tabText, { color: tab === t ? theme.primaryColor : theme.textSecondary }]}>
              {t === 'week' ? '주간' : '월간'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primaryColor} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* 사용 안내 */}
          <View style={s.guideBox}>
            <Lightbulb size={16} color={theme.textSecondary} style={{ marginTop: 1 }} />
            <Text style={[s.guideText, { color: theme.textSecondary, flex: 1 }]}>
              리포트 카드를 <Text style={{ fontWeight: '700' }}>길게 누르면 삭제</Text>할 수 있어요.
              같은 기간의 리포트를 다시 만들고 싶다면 먼저 삭제한 뒤 재생성해주세요.
            </Text>
          </View>

          {/* 졸업 후보 알림 */}
          {graduations.length > 0 && (
            <View style={[s.alertCard, { borderLeftColor: '#2ECC71' }]}>
              <Text style={s.alertTitle}>🎓 졸업 추천 습관</Text>
              {graduations.map((c) => (
                <View key={c.habit_id} style={{ marginTop: 8 }}>
                  <Text style={[s.alertMessage, { color: theme.textPrimary }]}>{c.message}</Text>
                  <Text style={[s.alertMeta, { color: theme.textSecondary }]}>
                    {c.weeks_evaluated}주 연속 {Math.round(c.completion_rate * 100)}% 이행, 긍정 감정 {Math.round(c.positive_emotion_ratio * 100)}%
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleGraduate(c)}
                    style={[s.alertBtn, { backgroundColor: '#2ECC71' }]}
                  >
                    <Text style={s.alertBtnText}>졸업하기</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            onPress={handleGenerateNow}
            disabled={generating}
            activeOpacity={0.85}
            style={s.generateBtn}
          >
            <LinearGradient
              colors={generating
                ? ['#C8CDD5', '#C8CDD5']
                : [theme.gradientColors[1], theme.gradientColors[2]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            {generating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[s.generateBtnText, { color: '#FFFFFF' }]}>
                {tab === 'week' ? '이번 주 리포트 생성하기' : '이번 달 리포트 생성하기'}
              </Text>
            )}
          </TouchableOpacity>

          {reports.length === 0 ? (
            <View style={s.empty}>
              <FileText size={48} color="#9CA3AF" strokeWidth={1.5} />
              <Text style={[s.emptyTitle, { color: theme.textPrimary }]}>아직 리포트가 없어요</Text>
              <Text style={[s.emptyDesc, { color: theme.textSecondary }]}>
                매주 일요일·매월 1일에{'\n'}리포트가 자동으로 만들어져요.
              </Text>
            </View>
          ) : (
            reports.map((r, idx) => (
              <ReportCard
                key={r.id}
                report={r}
                prevReport={reports[idx + 1]}  // 리스트는 period_start desc → 다음 인덱스가 직전 기간
                themeColor={theme.primaryColor}
                textPrimary={theme.textPrimary}
                textSecondary={theme.textSecondary}
                onPress={() => {
                  setSelected(r);
                  if (!r.read_at) {
                    markReportRead(r.id).then(() => load()).catch(() => {});
                  }
                }}
                onLongPress={() => handleDeleteReport(r)}
              />
            ))
          )}
        </ScrollView>
      )}

      <ReportDetailModal
        report={selected}
        theme={theme}
        onClose={() => setSelected(null)}
        onRate={handleRate}
      />

      <BadRatingModal
        report={badRatingTarget}
        theme={theme}
        onClose={() => setBadRatingTarget(null)}
        onSubmit={(comment) => {
          if (badRatingTarget) submitRate(badRatingTarget, 'bad', comment);
        }}
      />

    </View>
  );
}

interface ReportCardProps {
  report: ReportItem;
  prevReport?: ReportItem;             // 같은 period_type 직전 리포트 (트렌드 비교용)
  themeColor: string;
  textPrimary: string;
  textSecondary: string;
  onPress: () => void;
  onLongPress?: () => void;
}

/** 기간 내 활성 습관들의 (이행률, 해시태그별 이행률) 집계 — 카드와 모달 양쪽에서 사용 */
function _computePeriodStats(
  habits: Habit[],
  periodStart: string,
  periodEnd: string,
): { rate: number; tagRates: Record<string, number> } {
  const start = _parseISODate(periodStart);
  const end = _parseISODate(periodEnd);
  let totalExp = 0, totalDone = 0;
  const tagAgg: Record<string, { e: number; c: number }> = {};
  const active = habits.filter((h) => h.isActive && !h.deletedAt);
  for (const h of active) {
    let e = 0, c = 0;
    const cur = new Date(start);
    while (cur <= end) {
      if (_isHabitOnDay(h.frequency, _dayOfWeek(cur))) {
        e++;
        if (h.completionHistory[_fmtDate(cur)]) c++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    totalExp += e;
    totalDone += c;
    for (const tag of (h.hashtags || [])) {
      if (!tagAgg[tag]) tagAgg[tag] = { e: 0, c: 0 };
      tagAgg[tag].e += e;
      tagAgg[tag].c += c;
    }
  }
  const tagRates: Record<string, number> = {};
  for (const [t, v] of Object.entries(tagAgg)) {
    if (v.e > 0) tagRates[t] = v.c / v.e;
  }
  return {
    rate: totalExp > 0 ? totalDone / totalExp : 0,
    tagRates,
  };
}

const ARROW_UP = '↑';
const ARROW_DOWN = '↓';
const ARROW_FLAT = '–';

function _trendArrow(curr: number, prev: number | null, threshold = 0.05): {
  symbol: string; color: string; diffPct: number | null;
} {
  if (prev === null) return { symbol: '–', color: '#9CA3AF', diffPct: null };
  const diff = curr - prev;
  const diffPct = Math.round(diff * 100);
  if (diff > threshold) return { symbol: ARROW_UP, color: '#34C759', diffPct };
  if (diff < -threshold) return { symbol: ARROW_DOWN, color: '#FF3B30', diffPct };
  return { symbol: ARROW_FLAT, color: '#9CA3AF', diffPct };
}

function ReportCard({ report, prevReport, themeColor, textPrimary, textSecondary, onPress, onLongPress }: ReportCardProps) {
  const habits = useAppStore((s) => s.habits);
  const selectedHashtags = useAppStore((s) => s.selectedHashtags);
  const ratePct = Math.round(report.completion_rate * 100);
  const isUnread = !report.read_at;
  const intuitiveTitle = formatPeriodIntuitive(report.period_type, report.period_start);

  // 주요/보조 감정 (top 2)
  const topEmotions = useMemo(() => {
    return Object.entries(report.emotion_summary || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([key]) => EMOTIONS.find((e) => e.type === key))
      .filter(Boolean) as { emoji: string; label: string }[];
  }, [report.emotion_summary]);

  // 트렌드 화살표: 습관 이행률 + 사용자 선택 해시태그 중 변동폭 가장 큰 1개
  const trends = useMemo(() => {
    const curr = _computePeriodStats(habits, report.period_start, report.period_end);
    const prev = prevReport
      ? _computePeriodStats(habits, prevReport.period_start, prevReport.period_end)
      : null;

    const rateArrow = _trendArrow(report.completion_rate, prev ? prev.rate : null);

    // selectedHashtags 중 매칭 있는 것만 → 변동폭(절댓값) 가장 큰 1개 선정
    const candidates = selectedHashtags
      .filter((tag) => curr.tagRates[tag] !== undefined)
      .map((tag) => {
        const arrow = _trendArrow(
          curr.tagRates[tag],
          prev ? (prev.tagRates[tag] ?? null) : null,
        );
        return { tag, ...arrow };
      });

    // 직전 기간 있을 때만 변동 비교 의미. 없으면 첫 번째 태그를 placeholder
    const topTag = prev
      ? [...candidates].sort((a, b) =>
          Math.abs(b.diffPct ?? 0) - Math.abs(a.diffPct ?? 0)
        )[0]
      : candidates[0];

    return {
      rate: { ...rateArrow },
      topTag: topTag || null,
    };
  }, [habits, selectedHashtags, report.period_start, report.period_end, prevReport, report.completion_rate]);

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} delayLongPress={400} style={s.card}>
      {/* AI 뱃지 (있으면 우상단 절대 위치) */}
      {report.model_used === 'gemini' && (
        <View style={[s.aiBadgeAbsolute, { backgroundColor: themeColor + '1A' }]}>
          <Text style={[s.aiBadgeText, { color: themeColor }]}>AI</Text>
        </View>
      )}

      {/* 작은 회색 날짜 범위 (연도 포함) */}
      <Text style={[s.cardDateRange, { color: textSecondary }]}>
        {_formatDateRangeWithYear(report.period_start, report.period_end)}
      </Text>

      {/* 메인 타이틀 + NEW 인라인 */}
      <View style={s.cardPeriodRow}>
        <Text style={[s.cardMainPeriod, { color: themeColor }]}>{intuitiveTitle}</Text>
        {isUnread && (
          <View style={[s.newBadge, { backgroundColor: themeColor }]}>
            <Text style={s.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>

      {/* 이행률 (작게) */}
      <Text style={[s.cardSmallRate, { color: textSecondary }]}>습관 이행률 {ratePct}%</Text>

      {/* 주요/보조 감정 */}
      {topEmotions.length > 0 && (
        <View style={s.cardEmoRow}>
          {topEmotions.map((e, i) => (
            <View key={i} style={s.cardEmoItem}>
              <Text style={s.cardEmoEmoji}>{e.emoji}</Text>
              <Text style={[s.cardEmoLabel, { color: textPrimary }]}>{e.label}</Text>
              {i === 0 && topEmotions.length > 1 && (
                <Text style={[s.cardEmoSep, { color: textSecondary }]}>·</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* 트렌드 화살표 줄: 습관 이행률 + 변동폭 가장 큰 해시태그 1개 */}
      <View style={s.cardTrendRow}>
        <TrendChip label="습관 이행률" trend={trends.rate} textPrimary={textPrimary} textSecondary={textSecondary} />
        {trends.topTag && (
          <TrendChip
            label={trends.topTag.tag}
            trend={trends.topTag}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
          />
        )}
      </View>

      <Text style={[s.cardHint, { color: textSecondary }]}>길게 눌러 삭제</Text>
    </TouchableOpacity>
  );
}


/** 트렌드 칩: "라벨 5% ⬆" 형식 */
function TrendChip({ label, trend, textPrimary, textSecondary }: {
  label: string;
  trend: { symbol: string; color: string; diffPct: number | null };
  textPrimary: string;
  textSecondary: string;
}) {
  return (
    <View style={s.cardTrendItem}>
      <Text style={[s.cardTrendLabel, { color: textPrimary }]} numberOfLines={1}>{label}</Text>
      {trend.diffPct !== null && trend.diffPct !== 0 && (
        <Text style={[s.cardTrendDiff, { color: trend.color }]}>
          {Math.abs(trend.diffPct)}%
        </Text>
      )}
      <Text style={[s.cardTrendArrow, { color: trend.diffPct === null ? textSecondary : trend.color }]}>
        {trend.symbol}
      </Text>
    </View>
  );
}


/** "2026년 5월 11일 ~ 5월 17일" — 두 날짜 같은 해/월이면 중복 생략 */
function _formatDateRangeWithYear(startISO: string, endISO: string): string {
  const s = _parseISODate(startISO);
  const e = _parseISODate(endISO);
  const sY = s.getFullYear(), sM = s.getMonth() + 1, sD = s.getDate();
  const eY = e.getFullYear(), eM = e.getMonth() + 1, eD = e.getDate();
  if (sY === eY && sM === eM) {
    return `${sY}년 ${sM}월 ${sD}일 ~ ${eD}일`;
  }
  if (sY === eY) {
    return `${sY}년 ${sM}월 ${sD}일 ~ ${eM}월 ${eD}일`;
  }
  return `${sY}년 ${sM}월 ${sD}일 ~ ${eY}년 ${eM}월 ${eD}일`;
}

interface ModalProps {
  report: ReportItem | null;
  theme: any;
  onClose: () => void;
  onRate: (rating: Rating) => void;
}

function ReportDetailModal({ report, theme, onClose, onRate }: ModalProps) {
  const [accepted, setAccepted] = useState(false);
  const [editTarget, setEditTarget] = useState<Habit | null>(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const habits = useAppStore((s) => s.habits);

  if (!report) return null;
  const ratePct = Math.round(report.completion_rate * 100);
  const moodPct = report.avg_mood !== null
    ? Math.round((report.avg_mood + 1) * 50)
    : null;

  const emoEntries = Object.entries(report.emotion_summary || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const paragraphs = report.paragraphs && report.paragraphs.length > 0
    ? report.paragraphs
    : (report.full_report ? [report.full_report] : [report.insight]);

  const handleAcceptRecommendation = () => {
    const rec = report.recommendation;
    if (!rec) return;

    // add_habit 추천: 종류·빈도·시간대·소요시간 새 습관 추가 모달
    if (rec.kind === 'add_habit') {
      setShowAddHabit(true);
      return;
    }

    // 그 외 (reduce_frequency / rest 등): 기존 습관 수정 모달
    let target: Habit | undefined;
    if (rec.habit_id) {
      target = habits.find((h) => h.id === rec.habit_id);
    }
    if (!target) {
      target = habits.find((h) => h.isActive && !h.deletedAt);
    }

    if (!target) {
      showAlert({ title: '알림', message: '조정할 활성 습관이 없어요.' });
      setAccepted(true);
      return;
    }

    setEditTarget(target);
  };

  const handleEditSaved = () => {
    setAccepted(true);
    setEditTarget(null);
    showAlert({ title: '적용 완료', message: '습관이 업데이트되었어요. 다음 리포트에 반영됩니다.' });
  };

  const handleAddHabitSaved = () => {
    setAccepted(true);
    setShowAddHabit(false);
    showAlert({ title: '추가 완료', message: '새 습관이 추가됐어요. 다음 리포트에 반영됩니다.' });
  };

  return (
    <Modal visible={!!report} animationType="slide" onRequestClose={onClose} transparent>
      <View style={s.modalOverlay}>
        <View style={[s.modalContent, { backgroundColor: theme.backgroundColor }]}>
          <View style={s.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[s.modalTitle, { color: theme.textPrimary }]}>
                {formatPeriodIntuitive(report.period_type, report.period_start)}
              </Text>
              <Text style={[s.modalSubTitle, { color: theme.textSecondary }]}>
                {formatPeriodKR(report.period_start, report.period_end)}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Text style={{ color: theme.textSecondary, fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            {/* 통계 박스: 습관 이행률 / 평균 감정 점수 */}
            <View style={s.statsRow}>
              <View style={s.statBox}>
                <Text style={[s.statLabel, { color: theme.textSecondary }]}>습관 이행률</Text>
                <Text style={[s.statValue, { color: theme.primaryColor }]}>{ratePct}%</Text>
              </View>
              {moodPct !== null && (
                <View style={s.statBox}>
                  <Text style={[s.statLabel, { color: theme.textSecondary }]}>평균 감정 점수</Text>
                  <Text style={[s.statValue, { color: theme.primaryColor }]}>{moodPct}점</Text>
                </View>
              )}
            </View>

            {/* 주요 감정 / 보조 감정 — 같은 통계 박스 스타일 */}
            <View style={s.statsRow}>
              <View style={s.statBox}>
                <Text style={[s.statLabel, { color: theme.textSecondary }]}>주요 감정</Text>
                {emoEntries[0] ? (() => {
                  const info = EMOTIONS.find((e) => e.type === emoEntries[0][0]);
                  return (
                    <>
                      <Text style={s.statEmoji}>{info?.emoji || '·'}</Text>
                      <Text style={[s.statEmoLabel, { color: theme.textPrimary }]}>
                        {info?.label || emoEntries[0][0]}
                      </Text>
                      <Text style={[s.statEmoPct, { color: theme.primaryColor }]}>
                        {Math.round(emoEntries[0][1] * 100)}%
                      </Text>
                    </>
                  );
                })() : (
                  <Text style={[s.statEmptyDash, { color: theme.textSecondary }]}>–</Text>
                )}
              </View>
              <View style={s.statBox}>
                <Text style={[s.statLabel, { color: theme.textSecondary }]}>보조 감정</Text>
                {emoEntries[1] ? (() => {
                  const info = EMOTIONS.find((e) => e.type === emoEntries[1][0]);
                  return (
                    <>
                      <Text style={s.statEmoji}>{info?.emoji || '·'}</Text>
                      <Text style={[s.statEmoLabel, { color: theme.textPrimary }]}>
                        {info?.label || emoEntries[1][0]}
                      </Text>
                      <Text style={[s.statEmoPct, { color: theme.primaryColor }]}>
                        {Math.round(emoEntries[1][1] * 100)}%
                      </Text>
                    </>
                  );
                })() : (
                  <Text style={[s.statEmptyDash, { color: theme.textSecondary }]}>–</Text>
                )}
              </View>
            </View>

            {/* 분석 본문: 트렌드 표 + 성격 격려 + 감정-이행률 상관 + 줄글 narrative */}
            <View style={s.diagnosisSection}>
              <Text style={[s.diagnosisHeader, { color: theme.textPrimary }]}>
                {report.period_type === 'week' ? '이번 주는 이랬어요' : '이번 달은 이랬어요'}
              </Text>
              <PeriodBreakdownCard report={report} theme={theme} />
              <PersonalityProgressCard report={report} theme={theme} />
              {paragraphs.map((p, i) => (
                <Text key={i} style={[s.paragraph, { color: theme.textPrimary }]}>{p}</Text>
              ))}
              {report.model_used === 'gemini' && (
                <Text style={[s.modelTag, { color: theme.textSecondary }]}>AI 생성 (Gemini)</Text>
              )}
            </View>

            {/* 종합 진단 - 가장 강조되는 영역 (라벨 + 줄글 + 키워드) */}
            {report.diagnosis && (
              <View style={s.diagnosisSection}>
                <Text style={[s.diagnosisHeader, { color: theme.textPrimary }]}>종합 진단</Text>
                <View style={[s.diagnosisBox, { backgroundColor: theme.primaryColor + '14', borderColor: theme.primaryColor + '40' }]}>
                  <Text style={[s.diagnosisLabel, { color: theme.primaryColor }]}>{report.diagnosis}</Text>
                  {report.diagnosis_detail && (
                    <Text style={[s.diagnosisDetail, { color: theme.textPrimary }]}>
                      {report.diagnosis_detail}
                    </Text>
                  )}
                  {report.diagnosis_keywords.length > 0 && (
                    <View style={s.keywordRow}>
                      {report.diagnosis_keywords.map((kw) => (
                        <View key={kw} style={[s.keywordChip, { backgroundColor: theme.primaryColor + '20' }]}>
                          <Text style={[s.keywordText, { color: theme.primaryColor }]}>{kw}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* 권장 행동 (사용자 인터랙션) */}
            {report.recommendation && !accepted && (
              <View style={[s.recommendBox, { borderColor: theme.primaryColor + '40' }]}>
                <View style={s.recommendTitleRow}>
                  <Lightbulb size={16} color={theme.primaryColor} />
                  <Text style={[s.recommendTitle, { color: theme.textPrimary }]}>
                    추천: {report.recommendation.label}
                  </Text>
                </View>
                <Text style={[s.recommendMsg, { color: theme.textSecondary }]}>
                  {report.recommendation.message}
                </Text>
                <View style={s.recommendBtnRow}>
                  <TouchableOpacity
                    onPress={handleAcceptRecommendation}
                    style={[s.recommendBtn, { backgroundColor: theme.primaryColor }]}
                  >
                    <Text style={s.recommendBtnText}>적용해볼게요</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setAccepted(true)}
                    style={[s.recommendBtn, { backgroundColor: '#F5F6FA' }]}
                  >
                    <Text style={[s.recommendBtnText, { color: theme.textPrimary }]}>지금은 괜찮아요</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 만족도 평가 */}
            <View style={s.section}>
              <Text style={[s.sectionTitle, { color: theme.textPrimary }]}>이 리포트가 도움이 됐나요?</Text>
              <View style={s.ratingRow}>
                {(['good', 'neutral', 'bad'] as Rating[]).map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => onRate(r)}
                    style={[s.ratingBtn, { borderColor: theme.primaryColor + '40' }]}
                  >
                    <Text style={s.ratingEmoji}>{RATING_EMOJIS[r]}</Text>
                    <Text style={[s.ratingLabel, { color: theme.textPrimary }]}>{RATING_LABELS[r]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* 추천 클릭 시 띄우는 습관 수정 모달 */}
      <HabitEditModal
        visible={!!editTarget}
        habit={editTarget}
        recommendation={report.recommendation || undefined}
        onClose={() => setEditTarget(null)}
        onSaved={handleEditSaved}
      />

      {/* add_habit 추천 시 띄우는 새 습관 추가 모달 */}
      <AddHabitFromReportModal
        visible={showAddHabit}
        theme={theme}
        onClose={() => setShowAddHabit(false)}
        onSaved={handleAddHabitSaved}
      />
    </Modal>
  );
}


/* ── 새 습관 추가 모달 (리포트 추천에서 호출) ── */
interface AddHabitModalProps {
  visible: boolean;
  theme: any;
  onClose: () => void;
  onSaved: () => void;
}

const _ADD_FREQ_OPTIONS: { value: HabitFrequency; label: string }[] = [
  { value: 'daily', label: '매일' },
  { value: 'weekdays', label: '평일만' },
  { value: 'weekends', label: '주말만' },
];

const _ADD_TIME_OPTIONS: {
  value: TimeSlot; label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
}[] = [
  { value: 'morning', label: '아침', Icon: Sunrise },
  { value: 'lunch', label: '점심', Icon: Utensils },
  { value: 'afternoon', label: '오후', Icon: Sun },
  { value: 'evening', label: '저녁', Icon: Sunset },
  { value: 'bedtime', label: '잠들기 전', Icon: Moon },
  { value: 'anytime', label: '아무때나', Icon: Clock },
];

const _ADD_DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

function AddHabitFromReportModal({ visible, theme, onClose, onSaved }: AddHabitModalProps) {
  const addHabit = useAppStore((s) => s.addHabit);
  const selectedHashtags = useAppStore((s) => s.selectedHashtags);
  const habits = useAppStore((s) => s.habits);

  // 사용자 선택 해시태그에 매칭되는 템플릿 추천 (이미 추가된 습관은 제외)
  const candidateTemplates = useMemo(() => {
    const tagSet = new Set(selectedHashtags);
    const existingTitles = new Set(
      habits.filter((h) => h.isActive && !h.deletedAt).map((h) => h.title),
    );
    return recommendTemplates(tagSet, 12).filter((t) => !existingTitles.has(t.title));
  }, [selectedHashtags, habits]);

  const [pickedTemplate, setPickedTemplate] = useState<HabitTemplateItem | null>(null);
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('anytime');
  const [duration, setDuration] = useState(15);

  useEffect(() => {
    if (visible) {
      setPickedTemplate(null);
      setFrequency('daily');
      setTimeSlot('anytime');
      setDuration(15);
    }
  }, [visible]);

  // 템플릿 선택 시 추천 소요시간 prefill
  useEffect(() => {
    if (pickedTemplate) {
      const closest = _ADD_DURATION_OPTIONS.reduce((a, b) =>
        Math.abs(b - pickedTemplate.estimatedMinutes) < Math.abs(a - pickedTemplate.estimatedMinutes) ? b : a
      );
      setDuration(closest);
    }
  }, [pickedTemplate]);

  const handleSave = () => {
    if (!pickedTemplate) return;
    // 템플릿의 strengthenTags 중 사용자 선택 해시태그와 교집합만 유지
    const userTagSet = new Set(selectedHashtags);
    const habitTags = pickedTemplate.strengthenTags.filter((t) => userTagSet.has(t));
    addHabit({
      title: pickedTemplate.title,
      emoji: pickedTemplate.emoji,
      hashtags: habitTags.length > 0 ? habitTags : pickedTemplate.strengthenTags,
      frequency,
      timeSlot,
      duration,
    });
    pushSync().catch(() => {});
    onSaved();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={[s.modalContent, { backgroundColor: theme.backgroundColor }]}>
          <View style={s.modalHeader}>
            <Text style={[s.modalTitle, { color: theme.textPrimary }]}>
              {pickedTemplate ? '습관 설정' : '추천 습관'}
            </Text>
            <TouchableOpacity
              onPress={pickedTemplate ? () => setPickedTemplate(null) : onClose}
              style={s.closeBtn}
            >
              <Text style={{ color: theme.textSecondary, fontSize: 20 }}>
                {pickedTemplate ? '〈' : '✕'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
            {!pickedTemplate ? (
              <>
                <Text style={[s.addRecommendHint, { color: theme.textSecondary }]}>
                  선택하신 해시태그({selectedHashtags.join(' ') || '없음'})에 어울리는 습관이에요.
                  마음에 드는 걸 골라보세요.
                </Text>
                {candidateTemplates.length === 0 ? (
                  <Text style={[s.addRecommendEmpty, { color: theme.textSecondary }]}>
                    추가할 수 있는 새 습관 후보가 없어요. 이미 다 추가하셨거나 해시태그가 비어있을 수 있어요.
                  </Text>
                ) : (
                  candidateTemplates.map((t) => {
                    const userTagSet = new Set(selectedHashtags);
                    const matchedTags = t.strengthenTags.filter((tag) => userTagSet.has(tag));
                    return (
                      <TouchableOpacity
                        key={t.id}
                        onPress={() => setPickedTemplate(t)}
                        activeOpacity={0.7}
                        style={[s.addTemplateCard, { borderColor: theme.primaryColor + '30' }]}
                      >
                        <Text style={s.addTemplateEmoji}>{t.emoji}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={[s.addTemplateTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                            {t.title}
                          </Text>
                          <Text style={[s.addTemplateMeta, { color: theme.textSecondary }]} numberOfLines={1}>
                            약 {t.estimatedMinutes}분 · {matchedTags.join(' ')}
                          </Text>
                        </View>
                        <Text style={[s.addTemplateArrow, { color: theme.primaryColor }]}>›</Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </>
            ) : (
              <>
                <View style={[s.addPickedCard, { backgroundColor: theme.primaryColor + '14' }]}>
                  <Text style={s.addTemplateEmoji}>{pickedTemplate.emoji}</Text>
                  <Text style={[s.addPickedTitle, { color: theme.textPrimary }]}>
                    {pickedTemplate.title}
                  </Text>
                </View>

                <Text style={[s.addLabel, { color: theme.textPrimary }]}>빈도</Text>
                <View style={s.addChipRow}>
                  {_ADD_FREQ_OPTIONS.map((opt) => {
                    const isSel = JSON.stringify(opt.value) === JSON.stringify(frequency);
                    return (
                      <TouchableOpacity
                        key={opt.label}
                        onPress={() => setFrequency(opt.value)}
                        style={[s.addChip, { backgroundColor: isSel ? theme.primaryColor : theme.primaryColor + '14' }]}
                      >
                        <Text style={[s.addChipText, { color: isSel ? '#FFF' : theme.textPrimary }]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={[s.addLabel, { color: theme.textPrimary }]}>시간대</Text>
                <View style={s.addChipRow}>
                  {_ADD_TIME_OPTIONS.map((opt) => {
                    const isSel = timeSlot === opt.value;
                    const Icon = opt.Icon;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => setTimeSlot(opt.value)}
                        style={[
                          s.addChip,
                          {
                            backgroundColor: isSel ? theme.primaryColor : theme.primaryColor + '14',
                            flexDirection: 'row', alignItems: 'center', gap: 6,
                          },
                        ]}
                      >
                        <Icon size={14} color={isSel ? '#FFF' : theme.textPrimary} />
                        <Text style={[s.addChipText, { color: isSel ? '#FFF' : theme.textPrimary }]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={[s.addLabel, { color: theme.textPrimary }]}>소요 시간</Text>
                <View style={s.addChipRow}>
                  {_ADD_DURATION_OPTIONS.map((d) => {
                    const isSel = duration === d;
                    return (
                      <TouchableOpacity
                        key={d}
                        onPress={() => setDuration(d)}
                        style={[s.addChip, { backgroundColor: isSel ? theme.primaryColor : theme.primaryColor + '14' }]}
                      >
                        <Text style={[s.addChipText, { color: isSel ? '#FFF' : theme.textPrimary }]}>
                          {d}분
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  onPress={handleSave}
                  activeOpacity={0.8}
                  style={[s.addSaveBtn, { backgroundColor: theme.primaryColor }]}
                >
                  <Text style={s.addSaveText}>추가하기</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}


/* ── 기간 트렌드 표 (전체 이행률 + 해시태그별 이행률 + 강해진 습관) ── */
function _isHabitOnDay(frequency: HabitFrequency, dow: number): boolean {
  if (frequency === 'daily') return true;
  if (frequency === 'weekdays') return dow < 5;
  if (frequency === 'weekends') return dow >= 5;
  if (typeof frequency === 'object' && frequency.type === 'custom') {
    return frequency.days.includes(dow);
  }
  return true;
}

function _parseISODate(s: string): Date {
  return new Date(s + 'T00:00:00');
}

function _dayOfWeek(d: Date): number {
  const js = d.getDay();
  return js === 0 ? 6 : js - 1;
}

function _fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

interface PeriodCardProps {
  report: ReportItem;
  theme: any;
}

function PeriodBreakdownCard({ report, theme }: PeriodCardProps) {
  const habits = useAppStore((s) => s.habits);
  const selectedHashtags = useAppStore((s) => s.selectedHashtags);

  const stats = useMemo(() => {
    const start = _parseISODate(report.period_start);
    const end = _parseISODate(report.period_end);

    const tagMap: Record<string, { expected: number; completed: number }> = {};
    const habitStats: {
      id: string; title: string; hashtags: string[];
      expected: number; completed: number; rate: number;
    }[] = [];

    const active = habits.filter((h) => h.isActive && !h.deletedAt);
    const userTagSet = new Set(selectedHashtags);

    for (const h of active) {
      let expected = 0, completed = 0;
      const cur = new Date(start);
      while (cur <= end) {
        const dow = _dayOfWeek(cur);
        if (_isHabitOnDay(h.frequency, dow)) {
          expected++;
          if (h.completionHistory[_fmtDate(cur)]) completed++;
        }
        cur.setDate(cur.getDate() + 1);
      }
      if (expected > 0) {
        // 사용자가 선택한 해시태그 중에서만 노출
        const habitUserTags = (h.hashtags || []).filter((t) => userTagSet.has(t));
        habitStats.push({
          id: h.id, title: h.title, hashtags: habitUserTags,
          expected, completed,
          rate: completed / expected,
        });
      }
      (h.hashtags || []).forEach((tag) => {
        if (!tagMap[tag]) tagMap[tag] = { expected: 0, completed: 0 };
        tagMap[tag].expected += expected;
        tagMap[tag].completed += completed;
      });
    }

    const tagStats = Object.entries(tagMap)
      .filter(([, v]) => v.expected > 0)
      .map(([tag, v]) => ({ tag, rate: v.completed / v.expected, completed: v.completed, expected: v.expected }))
      .sort((a, b) => b.rate - a.rate);

    // 가장 강해진 습관 (이행률 70% 이상 top 2)
    const strongHabits = habitStats
      .filter((h) => h.rate >= 0.7)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 2);

    return { tagStats, habitStats, strongHabits };
  }, [habits, selectedHashtags, report.period_start, report.period_end]);

  if (stats.tagStats.length === 0) return null;

  return (
    <>
      <View style={s.breakdownCard}>
        <Text style={[s.breakdownTitle, { color: theme.textPrimary }]}>해시태그별 이행률</Text>
        {stats.tagStats.slice(0, 6).map(({ tag, rate, completed, expected }) => (
          <View key={tag} style={s.breakdownRow}>
            <Text style={[s.breakdownLabel, { color: theme.textPrimary }]} numberOfLines={1}>{tag}</Text>
            <View style={s.breakdownBarBg}>
              <View
                style={[
                  s.breakdownBarFill,
                  {
                    backgroundColor: theme.primaryColor,
                    width: `${Math.max(2, Math.round(rate * 100))}%`,
                  },
                ]}
              />
            </View>
            <Text style={[s.breakdownPercent, { color: theme.textSecondary }]}>
              {Math.round(rate * 100)}% ({completed}/{expected})
            </Text>
          </View>
        ))}
      </View>

      {/* 잘 이어간 습관 — 별도 카드로 분리해 위 카드와 가로폭 일치 */}
      {stats.strongHabits.length > 0 && (
        <View style={[s.breakdownCard, { backgroundColor: theme.primaryColor + '14' }]}>
          <Text style={[s.breakdownTitle, { color: theme.textPrimary }]}>
            이번 기간 특히 잘 이어간 습관
          </Text>
          {stats.strongHabits.map((h) => (
            <View key={h.id} style={s.strongHabitRow}>
              <View style={s.strongHabitTextWrap}>
                <Text style={[s.strongHabitTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                  {h.title}
                </Text>
                {h.hashtags.length > 0 && (
                  <Text
                    style={[s.strongHabitTags, { color: theme.textSecondary }]}
                    numberOfLines={1}
                  >
                    {h.hashtags.join(' ')}
                  </Text>
                )}
              </View>
              <Text style={[s.strongHabitPct, { color: theme.primaryColor }]}>
                {Math.round(h.rate * 100)}%
              </Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}


/* ── 성격 강화 격려 메시지 (현재 ↔ 이상적 자아 비교) ── */
function PersonalityProgressCard({ report, theme }: PeriodCardProps) {
  const habits = useAppStore((s) => s.habits);
  const personalityTypeId = useAppStore((s) => s.personalityTypeId);
  const idealPersonalityTypeId = useAppStore((s) => s.idealPersonalityTypeId);
  const userName = useAppStore((s) => s.userName);

  const message = useMemo(() => {
    const idealType = idealPersonalityTypeId ? findPersonalityType(idealPersonalityTypeId) : null;
    const currentType = personalityTypeId ? findPersonalityType(personalityTypeId) : null;
    if (!idealType && !currentType) return null;

    // 이상적 자아의 해시태그 중 이번 기간에 가장 많이 강화된 태그 찾기
    const start = _parseISODate(report.period_start);
    const end = _parseISODate(report.period_end);
    const targetTags = new Set<string>([
      ...(idealType?.hashtags || []),
      ...(currentType?.hashtags || []),
    ]);

    const tagCompletion: Record<string, { completed: number; expected: number }> = {};
    const active = habits.filter((h) => h.isActive && !h.deletedAt);
    for (const h of active) {
      const habitTags = (h.hashtags || []).filter((t) => targetTags.has(t));
      if (habitTags.length === 0) continue;
      let expected = 0, completed = 0;
      const cur = new Date(start);
      while (cur <= end) {
        if (_isHabitOnDay(h.frequency, _dayOfWeek(cur))) {
          expected++;
          if (h.completionHistory[_fmtDate(cur)]) completed++;
        }
        cur.setDate(cur.getDate() + 1);
      }
      for (const tag of habitTags) {
        if (!tagCompletion[tag]) tagCompletion[tag] = { completed: 0, expected: 0 };
        tagCompletion[tag].completed += completed;
        tagCompletion[tag].expected += expected;
      }
    }

    const strongTags = Object.entries(tagCompletion)
      .filter(([, v]) => v.expected > 0 && v.completed / v.expected >= 0.6)
      .map(([tag, v]) => ({ tag, rate: v.completed / v.expected }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 2);

    if (strongTags.length === 0) return null;

    const tagPhrase = strongTags.map((t) => t.tag).join(', ');
    const namePhrase = userName ? `${userName}님은 ` : '';

    if (idealType) {
      const idealTags = new Set(idealType.hashtags);
      const matchedIdeal = strongTags.filter((t) => idealTags.has(t.tag));
      if (matchedIdeal.length > 0) {
        return (
          `${namePhrase}이번 기간 ${tagPhrase} 영역에서 꾸준한 이행을 보여주셨어요. ` +
          `이건 ${userName ? '' : '회원'}${userName ? '' : '님이 '}되고 싶다고 하신 ` +
          `"${idealType.nameKR}"의 핵심 성향과 닿아있는 부분이에요. 지금처럼 이어가시면 한 발자국씩 가까워지고 있어요.`
        );
      }
    }
    return (
      `${namePhrase}이번 기간 ${tagPhrase} 영역의 습관이 잘 자리잡고 있어요. ` +
      `반복된 행동이 결국 본인의 성향을 더 강하게 만들어줍니다.`
    );
  }, [habits, personalityTypeId, idealPersonalityTypeId, userName, report.period_start, report.period_end]);

  if (!message) return null;

  return (
    <View style={[s.personalityBox, { backgroundColor: theme.primaryColor + '0D', borderColor: theme.primaryColor + '30' }]}>
      <Sparkles size={18} color={theme.primaryColor} />
      <Text style={[s.personalityText, { color: theme.textPrimary }]}>{message}</Text>
    </View>
  );
}


/* ── 아쉬워요 사유 수집 모달 ── */
const BAD_REASON_OPTIONS = [
  '리포트가 너무 짧음',
  '감정 분석이 부족함',
  '추천 행동이 적합하지 않음',
  '데이터 분석이 부정확함',
  '표현이 어색하거나 어렵게 느껴짐',
  '내 상황과 맞지 않는 진단',
];

interface BadRatingModalProps {
  report: ReportItem | null;
  theme: any;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

function BadRatingModal({ report, theme, onClose, onSubmit }: BadRatingModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [freeText, setFreeText] = useState('');

  useEffect(() => {
    if (report) {
      setSelected(new Set());
      setFreeText('');
    }
  }, [report]);

  if (!report) return null;

  const toggle = (opt: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });
  };

  const canSubmit = selected.size > 0 || freeText.trim().length > 0;

  const handleSubmit = () => {
    const parts: string[] = [];
    if (selected.size > 0) parts.push(Array.from(selected).join('; '));
    if (freeText.trim()) parts.push(freeText.trim());
    onSubmit(parts.join(' / '));
  };

  return (
    <Modal visible={!!report} animationType="slide" onRequestClose={onClose} transparent>
      <View style={s.modalOverlay}>
        <View style={[s.modalContent, { backgroundColor: theme.backgroundColor }]}>
          <View style={s.modalHeader}>
            <Text style={[s.modalTitle, { color: theme.textPrimary }]}>
              어떤 부분이 아쉬웠나요?
            </Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Text style={{ color: theme.textSecondary, fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={[s.badRatingHint, { color: theme.textSecondary }]}>
            다음 리포트에 반영해 더 도움되는 내용을 드릴게요.
          </Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
            {BAD_REASON_OPTIONS.map((opt) => {
              const isSel = selected.has(opt);
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => toggle(opt)}
                  activeOpacity={0.7}
                  style={[
                    s.badReasonRow,
                    {
                      borderColor: isSel ? theme.primaryColor : '#E5E7EB',
                      backgroundColor: isSel ? theme.primaryColor + '14' : 'transparent',
                    },
                  ]}
                >
                  <View
                    style={[
                      s.badReasonCheckbox,
                      {
                        borderColor: isSel ? theme.primaryColor : '#C8CDD5',
                        backgroundColor: isSel ? theme.primaryColor : 'transparent',
                      },
                    ]}
                  >
                    {isSel && <Text style={s.badReasonCheckMark}>✓</Text>}
                  </View>
                  <Text style={[s.badReasonText, { color: theme.textPrimary }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}

            <Text style={[s.badRatingFreeLabel, { color: theme.textSecondary }]}>
              직접 적어주실 부분이 있다면 (선택)
            </Text>
            <TextInput
              style={[
                s.badRatingFreeInput,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.primaryColor + '0D',
                  borderColor: '#E5E7EB',
                },
              ]}
              placeholder="더 보완됐으면 하는 부분을 자유롭게 적어주세요"
              placeholderTextColor="#9CA3AF80"
              multiline
              value={freeText}
              onChangeText={setFreeText}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit}
              activeOpacity={0.8}
              style={[
                s.badRatingSubmit,
                { backgroundColor: canSubmit ? theme.primaryColor : '#C8CDD5' },
              ]}
            >
              <Text style={s.badRatingSubmitText}>의견 보내기</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}


const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  tabText: { fontSize: 15, fontWeight: '600' },
  generateBtn: {
    paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, overflow: 'hidden',
  },
  generateBtnText: { fontSize: 15, fontWeight: '700' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 8 },
  emptyEmoji: { fontSize: 50 },
  emptyTitle: { fontSize: 17, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  card: {
    backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 18, marginBottom: 4 },
  aiBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  aiBadgeAbsolute: {
    position: 'absolute', top: 12, right: 12,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, zIndex: 1,
  },
  aiBadgeText: { fontSize: 10, fontWeight: '700' },
  cardPeriodRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },

  // 안내 박스
  guideBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#F5F6FA', padding: 12, borderRadius: 10, marginBottom: 12,
  },
  guideText: { fontSize: 12, lineHeight: 18 },

  // 새 카드 레이아웃
  cardDateRange: { fontSize: 11, marginBottom: 2 },
  cardMainPeriod: {
    fontSize: 24, fontWeight: '700',
  },
  cardSmallRate: {
    fontSize: 12, marginBottom: 12,                       // 이행률 작게
  },
  cardEmoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12,
  },
  cardEmoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardEmoEmoji: { fontSize: 16 },
  cardEmoLabel: { fontSize: 13, fontWeight: '500' },
  cardEmoSep: { fontSize: 14, marginHorizontal: 4 },
  cardTrendRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F1F5',
  },
  cardTrendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardTrendLabel: { fontSize: 12, fontWeight: '500' },
  cardTrendDiff: { fontSize: 12, fontWeight: '700' },
  cardTrendArrow: { fontSize: 14, fontWeight: '700' },

  cardHint: { fontSize: 10, marginTop: 10, opacity: 0.5 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  newBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  newBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  modalSubTitle: { fontSize: 12, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: {
    paddingTop: 24, paddingHorizontal: 20, paddingBottom: 20,
    borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700' },
  closeBtn: { padding: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#F5F6FA', alignItems: 'center' },
  statLabel: { fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '700' },
  statEmoji: { fontSize: 26, marginTop: 2 },
  statEmoLabel: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  statEmoPct: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  statEmptyDash: { fontSize: 22, fontWeight: '500', marginTop: 8, marginBottom: 8 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  emoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  emoEmoji: { fontSize: 20, width: 28 },
  emoLabel: { flex: 1, fontSize: 14 },
  emoScore: { fontSize: 13, fontWeight: '600' },
  insightBig: { fontSize: 15, lineHeight: 22 },
  modelTag: { fontSize: 11, marginTop: 6 },
  ratingRow: { flexDirection: 'row', gap: 10 },
  ratingBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, alignItems: 'center', gap: 4,
  },
  ratingEmoji: { fontSize: 24 },
  ratingLabel: { fontSize: 12, fontWeight: '600' },
  alertCard: {
    backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10,
    borderLeftWidth: 4, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  alertTitle: { fontSize: 14, fontWeight: '700' },
  alertMessage: { fontSize: 13, lineHeight: 19 },
  alertMeta: { fontSize: 12, lineHeight: 17 },
  alertBtn: {
    marginTop: 10, paddingVertical: 10, borderRadius: 8, alignItems: 'center',
  },
  alertBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  narrativeSummary: {
    fontSize: 16, fontWeight: '600', lineHeight: 24, marginBottom: 16,
  },
  paragraph: {
    fontSize: 14, lineHeight: 22, marginBottom: 12,
  },
  diagnosisSection: { marginBottom: 20 },
  diagnosisHeader: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  diagnosisBox: {
    padding: 18, borderRadius: 12, borderWidth: 1.5, gap: 12,
  },
  diagnosisLabel: { fontSize: 17, fontWeight: '700', lineHeight: 24 },
  diagnosisDetail: { fontSize: 14, lineHeight: 22 },
  keywordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  keywordChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  keywordText: { fontSize: 12, fontWeight: '600' },
  // 기존 호환용 (사용처 있을 수 있음)
  diagnosisText: { fontSize: 17, fontWeight: '700', lineHeight: 24 },
  recommendBox: {
    padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 16,
  },
  recommendTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  recommendTitle: { fontSize: 14, fontWeight: '700' },
  recommendMsg: { fontSize: 13, lineHeight: 19, marginBottom: 12 },
  recommendBtnRow: { flexDirection: 'row', gap: 8 },
  recommendBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  recommendBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // 감정 분포 카드 (주요/보조 감정)
  emoCardRow: { flexDirection: 'row', gap: 12 },
  emoCard: {
    flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#F5F6FA',
    alignItems: 'center', gap: 6,
  },
  emoCardRole: { fontSize: 11, fontWeight: '500' },
  emoCardMain: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  emoCardEmoji: { fontSize: 24 },
  emoCardLabel: { fontSize: 16, fontWeight: '700' },
  emoCardPct: { fontSize: 14, fontWeight: '700' },

  // PeriodBreakdownCard
  breakdownCard: {
    padding: 14, borderRadius: 12, backgroundColor: '#F8F9FB',
    marginBottom: 16,
  },
  breakdownTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  breakdownRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
  },
  breakdownLabel: { fontSize: 13, width: 80 },
  breakdownBarBg: {
    flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden',
  },
  breakdownBarFill: { height: '100%', borderRadius: 4 },
  breakdownPercent: { fontSize: 11, width: 86, textAlign: 'right' },
  strongHabitsBox: {
    marginTop: 12, padding: 12, borderRadius: 10, gap: 8,
  },
  strongHabitsTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  strongHabitRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  strongHabitTextWrap: { flex: 1 },
  strongHabitTitle: { fontSize: 14, fontWeight: '600' },
  strongHabitTags: { fontSize: 12, marginTop: 2 },
  strongHabitPct: { fontSize: 16, fontWeight: '800', textAlign: 'right' },

  // PersonalityProgressCard
  personalityBox: {
    flexDirection: 'row', padding: 14, borderRadius: 12, borderWidth: 1,
    marginBottom: 16, gap: 10,
  },
  personalityEmoji: { fontSize: 18 },
  personalityText: { flex: 1, fontSize: 13, lineHeight: 20 },

  // BadRatingModal
  badRatingHint: { fontSize: 13, marginBottom: 12 },
  badReasonRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 12,
    borderRadius: 10, borderWidth: 1, marginBottom: 8, gap: 10,
  },
  badReasonCheckbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  badReasonCheckMark: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  badReasonText: { fontSize: 14, flex: 1 },
  badRatingFreeLabel: { fontSize: 13, marginTop: 8, marginBottom: 6 },
  badRatingFreeInput: {
    borderWidth: 1, borderRadius: 10, padding: 12,
    minHeight: 80, fontSize: 14, textAlignVertical: 'top',
  },
  badRatingSubmit: {
    marginTop: 16, paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  badRatingSubmitText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  // AddHabitFromReportModal
  addLabel: { fontSize: 13, fontWeight: '700', marginTop: 14, marginBottom: 8 },
  addRecommendHint: { fontSize: 13, lineHeight: 19, marginBottom: 14 },
  addRecommendEmpty: { fontSize: 13, lineHeight: 19, marginTop: 16, textAlign: 'center' },
  addTemplateCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, borderRadius: 10, borderWidth: 1, gap: 12, marginBottom: 8,
  },
  addTemplateEmoji: { fontSize: 24 },
  addTemplateTitle: { fontSize: 14, fontWeight: '700' },
  addTemplateMeta: { fontSize: 12, marginTop: 2 },
  addTemplateArrow: { fontSize: 22, fontWeight: '700' },
  addPickedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 12, marginBottom: 6,
  },
  addPickedTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  addChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  addChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
  },
  addChipText: { fontSize: 13, fontWeight: '500' },
  addSaveBtn: {
    marginTop: 20, paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  addSaveText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
