import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { GradientText } from '../../components/common/GradientText';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import type { Habit, HabitFrequency, TimeSlot } from '../../types/habit';
import { getUnreadCount } from '../../services/reports';
import { schedulePush } from '../../services/sync';
import { Sunrise, Train, Utensils, Sun, Sunset, Moon, Clock, Check, Undo2, Pencil, BarChart3 } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';

type CalendarViewMode = 'week' | 'month';

/* ──────────── helpers ──────────── */
function pad2(n: number) { return String(n).padStart(2, '0'); }
function fmtDate(d: Date) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function isToday(d: Date) {
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function getWeekStart(d: Date): Date {
  let cur = startOfDay(d);
  while (cur.getDay() !== 1) cur = addDays(cur, -1);
  return cur;
}
function getWeekLabel(weekStart: Date): string {
  // 주의 목요일 기준으로 해당 월과 몇째 주인지 계산
  const thu = addDays(weekStart, 3);
  const month = thu.getMonth() + 1;
  const firstOfMonth = new Date(thu.getFullYear(), thu.getMonth(), 1);
  const firstMonday = addDays(firstOfMonth, (8 - firstOfMonth.getDay()) % 7 || 7);
  // firstMonday가 1일 이후이면 1일~firstMonday 전이 1째주
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
function getWeekDays(start: Date): Date[] { return Array.from({ length: 7 }, (_, i) => addDays(start, i)); }
function getMonthWeeks(date: Date): Date[][] {
  const y = date.getFullYear(), m = date.getMonth();
  let cur = getWeekStart(new Date(y, m, 1));
  const lastDay = new Date(y, m + 1, 0);
  const weeks: Date[][] = [];
  while (cur <= lastDay || (weeks.length > 0 && weeks[weeks.length - 1].length < 7)) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) { week.push(new Date(cur)); cur = addDays(cur, 1); }
    weeks.push(week);
    if (weeks.length >= 6) break;
  }
  return weeks;
}
function isHabitOnDay(freq: HabitFrequency, dow: number): boolean {
  if (freq === 'daily') return true;
  if (freq === 'weekdays') return dow < 5;
  if (freq === 'weekends') return dow >= 5;
  if (typeof freq === 'object' && freq.type === 'custom') return freq.days.includes(dow);
  return true;
}
function getDow(d: Date): number { const js = d.getDay(); return js === 0 ? 6 : js - 1; }

const TIME_SLOT_ORDER: TimeSlot[] = ['morning', 'commute', 'lunch', 'afternoon', 'anytime', 'evening', 'bedtime'];
const TIME_SLOT_ICON: Record<TimeSlot, React.ComponentType<{ size?: number; color?: string }>> = {
  morning: Sunrise,
  commute: Train,
  lunch: Utensils,
  afternoon: Sun,
  evening: Sunset,
  bedtime: Moon,
  anytime: Clock,
};
const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

/* ──────────── component ──────────── */
export function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const userName = useAppStore((s) => s.userName);
  const userIcon = useAppStore((s) => s.userIcon);
  const habits = useAppStore((s) => s.habits);
  const toggleHabitCompletion = useAppStore((s) => s.toggleHabitCompletion);

  // 미열람 리포트 수 (포커스마다 갱신)
  const [unreadReports, setUnreadReports] = useState(0);
  useFocusEffect(
    useCallback(() => {
      getUnreadCount().then(setUnreadReports).catch(() => setUnreadReports(0));
    }, []),
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');
  const [isExpanded, setIsExpanded] = useState(false);

  // 레몬색 투명도 높인 그라데이션 (로고 외 UI용)
  const softGradient: [string, string] = [theme.gradientColors[1], theme.gradientColors[2]];

  const headerTitle = useMemo(() => {
    if (viewMode === 'week') {
      return getWeekLabel(weekStart);
    }
    return `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월`;
  }, [viewMode, weekStart, selectedDate]);

  const sortedHabits = useMemo(() => {
    const dow = getDow(selectedDate);
    const ds = fmtDate(selectedDate);
    return habits.filter((h) => h.isActive && isHabitOnDay(h.frequency, dow)).sort((a, b) => {
      const ac = !!a.completionHistory[ds], bc = !!b.completionHistory[ds];
      if (ac !== bc) return ac ? 1 : -1;
      return TIME_SLOT_ORDER.indexOf(a.timeSlot) - TIME_SLOT_ORDER.indexOf(b.timeSlot);
    });
  }, [habits, selectedDate]);

  const completedCount = useMemo(() => {
    const ds = fmtDate(selectedDate);
    return sortedHabits.filter((h) => !!h.completionHistory[ds]).length;
  }, [sortedHabits, selectedDate]);

  const displayHabits = isExpanded ? sortedHabits : sortedHabits.slice(0, 3);

  const getCompletionRate = useCallback((d: Date): number => {
    const dow = getDow(d), ds = fmtDate(d);
    const active = habits.filter((h) => h.isActive && isHabitOnDay(h.frequency, dow));
    if (!active.length) return 0;
    return active.filter((h) => !!h.completionHistory[ds]).length / active.length;
  }, [habits]);

  const summaryRate = useMemo(() => {
    let total = 0, done = 0;
    if (viewMode === 'week') {
      for (let i = 0; i < 7; i++) {
        const d = addDays(weekStart, i), dow = getDow(d), ds = fmtDate(d);
        habits.forEach((h) => {
          if (h.isActive && isHabitOnDay(h.frequency, dow)) { total++; if (h.completionHistory[ds]) done++; }
        });
      }
    } else {
      const y = selectedDate.getFullYear(), m = selectedDate.getMonth();
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(y, m, day), dow = getDow(d), ds = fmtDate(d);
        habits.forEach((h) => {
          if (h.isActive && isHabitOnDay(h.frequency, dow)) { total++; if (h.completionHistory[ds]) done++; }
        });
      }
    }
    return total > 0 ? done / total : 0;
  }, [habits, viewMode, weekStart, selectedDate]);

  const summaryTitle = useMemo(() => {
    if (viewMode === 'week') return getWeekLabel(weekStart) + ' 요약';
    return `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 요약`;
  }, [viewMode, weekStart, selectedDate]);

  const navigatePrev = () => {
    if (viewMode === 'week') { const nw = addDays(weekStart, -7); setWeekStart(nw); setSelectedDate(nw); }
    else setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };
  const navigateNext = () => {
    if (viewMode === 'week') { const nw = addDays(weekStart, 7); setWeekStart(nw); setSelectedDate(nw); }
    else setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };
  const goToday = () => { setSelectedDate(new Date()); setWeekStart(getWeekStart(new Date())); };

  const selectedDateText = isToday(selectedDate) ? '오늘의 습관'
    : (() => { const m = selectedDate.getMonth() + 1, d = selectedDate.getDate(), wd = ['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()]; return `${m}월 ${d}일 (${wd})`; })();

  const toggleHabit = useCallback((id: string) => {
    toggleHabitCompletion(id, fmtDate(selectedDate));
    schedulePush();
  }, [selectedDate, toggleHabitCompletion]);

  /* ── day cell ── */
  const renderDayCell = (date: Date) => {
    const selected = isSameDay(date, selectedDate);
    const today = isToday(date);
    const rate = getCompletionRate(date);
    const dotColor = rate >= 0.8 ? '#34C759' : rate >= 0.5 ? '#FF9500' : rate > 0 ? '#FF3B30' : null;
    const inner = (
      <>
        <Text style={[s.dayNum, { color: selected ? '#FFF' : today ? theme.primaryColor : theme.textPrimary, fontWeight: today ? '700' : '400' }]}>
          {date.getDate()}
        </Text>
        <View style={[s.dayDot, { backgroundColor: dotColor ? (selected ? '#FFF' : dotColor) : 'transparent' }]} />
      </>
    );
    return (
      <TouchableOpacity key={fmtDate(date)} style={s.dayCellOuter} onPress={() => { setSelectedDate(date); if (viewMode === 'week') setWeekStart(getWeekStart(date)); }} activeOpacity={0.7}>
        {selected ? (
          <View style={s.dayCellClip}>
            <LinearGradient colors={softGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.dayCellInner}>{inner}</LinearGradient>
          </View>
        ) : (
          <View style={s.dayCellBg}>{inner}</View>
        )}
      </TouchableOpacity>
    );
  };

  /* ── habit row ── */
  const swipeableRefs = useRef<Map<string, Swipeable | null>>(new Map());

  const renderRightActions = (habit: Habit, done: boolean) => () => (
    // 우→좌 스와이프: 미완료면 완료, 완료면 취소
    <View style={[s.swipeAction, { backgroundColor: done ? '#FF9500' : '#34C759' }]}>
      {done ? (
        <Undo2 size={22} color="#FFFFFF" />
      ) : (
        <Check size={22} color="#FFFFFF" />
      )}
      <Text style={s.swipeActionText}>{done ? '취소' : '완료'}</Text>
    </View>
  );

  const renderHabitRow = (habit: Habit) => {
    const ds = fmtDate(selectedDate);
    const done = !!habit.completionHistory[ds];
    const isToday_ = isToday(selectedDate);
    const isFuture = startOfDay(selectedDate).getTime() > startOfDay(new Date()).getTime();

    const rowInner = (
      <View key={habit.id} style={s.habitRow}>
        {/* 정보 영역 - 우측 버튼과 동일한 동작 */}
        <TouchableOpacity
          style={s.habitInfoTouch}
          onPress={() => {
            if (isFuture) return;
            if (isToday_ && !done) {
              navigation?.navigate?.('HabitTimer', { habitId: habit.id });
            } else {
              toggleHabit(habit.id);
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={s.habitEmoji}>{habit.emoji}</Text>
          <View style={s.habitInfo}>
            <Text
              style={[
                s.habitTitle,
                { color: done ? '#9CA3AF' : theme.textPrimary, textDecorationLine: done ? 'line-through' : 'none' },
              ]}
              numberOfLines={1}
            >
              {habit.title}
            </Text>
            <View style={s.habitMeta}>
              {(() => {
                const TimeIcon = TIME_SLOT_ICON[habit.timeSlot];
                return <TimeIcon size={14} color="#9CA3AF" />;
              })()}
              <Text style={s.habitMetaText}>{habit.duration}분</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 우측 버튼:
            - 완료: ✓ (토글)
            - 오늘 미완료: ▶ → 타이머 진입
            - 과거 미완료: ○ (토글)
            - 미래 미완료: ▶ (비활성, 시각만)
        */}
        {done ? (
          <TouchableOpacity onPress={() => toggleHabit(habit.id)} activeOpacity={0.7}>
            <View style={s.checkboxClip}>
              <LinearGradient colors={softGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.checkboxGrad}>
                <Text style={s.checkmark}>✓</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ) : isToday_ ? (
          <TouchableOpacity
            onPress={() => navigation?.navigate?.('HabitTimer', { habitId: habit.id })}
            activeOpacity={0.7}
          >
            <View style={s.playClip}>
              <LinearGradient colors={softGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.playGrad}>
                <Text style={s.playMark}>▶</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ) : isFuture ? (
          <View style={[s.playClip, { opacity: 0.4 }]}>
            <LinearGradient colors={softGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.playGrad}>
              <Text style={s.playMark}>▶</Text>
            </LinearGradient>
          </View>
        ) : (
          <TouchableOpacity onPress={() => toggleHabit(habit.id)} activeOpacity={0.7}>
            <View style={s.playClip}>
              <LinearGradient colors={softGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.playGrad}>
                <Text style={s.playMark}>○</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );

    // 미래 날짜는 swipe 비활성 (마킹 불가)
    if (isFuture) return rowInner;

    return (
      <Swipeable
        key={habit.id}
        ref={(ref) => { swipeableRefs.current.set(habit.id, ref); }}
        renderRightActions={renderRightActions(habit, done)}
        rightThreshold={50}
        overshootRight={false}
        friction={2}
        onSwipeableOpen={(direction) => {
          if (direction === 'right') {
            toggleHabit(habit.id);
            // close after action fires
            setTimeout(() => swipeableRefs.current.get(habit.id)?.close(), 150);
          }
        }}
      >
        {rowInner}
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={[s.safeArea, { backgroundColor: theme.backgroundColor }]} edges={['top']}>
      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerCircleBtn} onPress={() => navigation?.navigate?.('Report')} activeOpacity={0.7}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: '-45deg' }] }}>
            <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill={theme.primaryColor} />
          </Svg>
          {unreadReports > 0 && (
            <View style={s.headerBadge}>
              <Text style={s.headerBadgeText}>
                {unreadReports > 9 ? '9+' : unreadReports}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <View style={s.headerLogoWrap}>
            <View style={s.headerCube}>
              <LinearGradient colors={['#EFF8D1', 'transparent']} style={s.headerCubeTop} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
              <LinearGradient colors={['#DBEFD8', '#ACD9E9', '#98D2F0']} style={s.headerCubeFront} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
              <LinearGradient colors={['#9CDBEE', '#6BE1EE', '#97E7EC']} style={s.headerCubeRight} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            </View>
            <GradientText text="HABITS" colors={theme.gradientColors} style={s.headerLogoText} />
          </View>
        </View>
        <TouchableOpacity style={s.headerCircleBtn} onPress={() => navigation?.navigate?.('MyPage')} activeOpacity={0.7}>
          <Text style={[s.headerMyText, { color: theme.primaryColor }]}>MY</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 30 }]} showsVerticalScrollIndicator={false}>
        {/* NAV */}
        <View style={s.navContainer}>
          <View style={s.navRow}>
            <TouchableOpacity onPress={navigatePrev}><Text style={[s.navArrow, { color: theme.primaryColor }]}>‹</Text></TouchableOpacity>
            <Text style={[s.navTitle, { color: theme.textPrimary }]}>{headerTitle}</Text>
            <TouchableOpacity onPress={navigateNext}><Text style={[s.navArrow, { color: theme.primaryColor }]}>›</Text></TouchableOpacity>
          </View>
          {!isToday(selectedDate) && (
            <TouchableOpacity style={[s.todayBtn, { backgroundColor: theme.primaryColor }]} onPress={goToday}>
              <Text style={s.todayBtnText}>오늘</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* TOGGLE */}
        <View style={s.toggleContainer}>
          <View style={s.toggleBg}>
            {(['week', 'month'] as CalendarViewMode[]).map((mode) => {
              const active = viewMode === mode;
              const label = mode === 'week' ? '주간' : '월간';
              return (
                <TouchableOpacity key={mode} onPress={() => setViewMode(mode)} activeOpacity={0.8}>
                  <View style={[s.togglePill, active && s.togglePillActive]}>
                    {active && <LinearGradient colors={softGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />}
                    <Text style={active ? s.toggleActiveText : s.toggleInactiveText}>{label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CALENDAR */}
        <View style={s.card}>
          <View style={s.dayLabelRow}>
            {DAY_LABELS.map((d) => (<View key={d} style={s.dayLabelCell}><Text style={s.dayLabel}>{d}</Text></View>))}
          </View>
          {viewMode === 'week' ? (
            <View style={s.weekRow}>{getWeekDays(weekStart).map(renderDayCell)}</View>
          ) : (
            getMonthWeeks(selectedDate).map((week, wi) => (
              <View key={wi} style={[s.weekRow, wi > 0 && { marginTop: 4 }]}>{week.map(renderDayCell)}</View>
            ))
          )}
        </View>

        {/* HABITS */}
        <View style={s.card}>
          <View style={s.habitHeader}>
            <Text style={[s.habitHeaderTitle, { color: theme.textPrimary }]}>{selectedDateText}</Text>
            <Text style={s.habitHeaderCount}>{completedCount}/{sortedHabits.length}</Text>
          </View>
          {sortedHabits.length === 0 ? (
            <Text style={s.emptyText}>오늘은 수행할 습관이 없어요</Text>
          ) : (
            <>
              {displayHabits.map(renderHabitRow)}
              {sortedHabits.length > 3 && (
                <TouchableOpacity style={s.expandBtn} onPress={() => setIsExpanded(!isExpanded)}>
                  <Text style={s.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>


        {/* QUICK ACTIONS */}
        <View style={s.quickRow}>
          <TouchableOpacity style={[{ flex: 1 }, s.quickAction]} onPress={() => navigation?.navigate?.('DiaryWrite')} activeOpacity={0.8}>
            <LinearGradient colors={softGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
            <View style={s.quickInner}>
              <Pencil size={16} color="#FFFFFF" />
              <Text style={s.quickGradientText}>일기 쓰기</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[{ flex: 1 }, s.quickWhite]} onPress={() => navigation?.navigate?.('FeedbackSummary')} activeOpacity={0.8}>
            <View style={s.quickInner}>
              <BarChart3 size={16} color={theme.primaryColor} />
              <Text style={[s.quickWhiteText, { color: theme.primaryColor }]}>피드백</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* WEEKLY SUMMARY */}
        <View style={s.card}>
          <View style={s.summaryHeader}>
            <Text style={[s.summaryTitle, { color: theme.textPrimary }]}>{summaryTitle}</Text>
            <Text style={[s.summaryPercent, { color: theme.primaryColor }]}>{Math.round(summaryRate * 100)}%</Text>
          </View>
          <View style={s.progressBg}>
            {summaryRate > 0 && (
              <LinearGradient colors={softGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[s.progressFill, { width: `${Math.max(3, Math.round(summaryRate * 100))}%` as any }]} />
            )}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerLogoWrap: { width: 130, height: 70, alignItems: 'center', justifyContent: 'center' },
  headerCube: { width: 96, height: 96, position: 'absolute' },
  headerCubeTop: { width: 60, height: 30, borderRadius: 7, position: 'absolute', top: 2, left: 17, opacity: 0.3, transform: [{ skewX: '-10deg' }] },
  headerCubeFront: { width: 57, height: 54, borderBottomLeftRadius: 9, borderBottomRightRadius: 9, borderTopLeftRadius: 3, position: 'absolute', top: 23, left: 5, opacity: 0.35 },
  headerCubeRight: { width: 43, height: 54, borderBottomRightRadius: 9, borderTopRightRadius: 3, position: 'absolute', top: 23, left: 48, opacity: 0.6 },
  headerLogoText: { fontSize: 28, fontWeight: '900', letterSpacing: 2, zIndex: 10 },
  headerCircleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  headerBadge: {
    position: 'absolute', top: -2, right: -2,
    minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5, borderColor: '#FFF',
  },
  headerBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  headerCircleIcon: { fontSize: 18 },
  headerMyText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
  scrollContent: { paddingHorizontal: 20, gap: 20 },
  navContainer: { position: 'relative', alignItems: 'center' },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  navArrow: { fontSize: 20, fontWeight: '300', paddingHorizontal: 8 },
  navTitle: { textAlign: 'center', fontSize: 17, fontWeight: '600', marginHorizontal: 8 },
  todayBtn: { position: 'absolute', right: 0, top: '50%', transform: [{ translateY: -12 }], paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  todayBtnText: { color: '#FFF', fontSize: 12, fontWeight: '500' },
  toggleContainer: { alignItems: 'center' },
  toggleBg: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  togglePill: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 16, overflow: 'hidden' as const },
  togglePillActive: { overflow: 'hidden' as const },
  toggleActiveText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  toggleInactiveText: { fontSize: 15, color: '#666' },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  dayLabelRow: { flexDirection: 'row', marginBottom: 8 },
  dayLabelCell: { flex: 1, alignItems: 'center' },
  dayLabel: { fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  weekRow: { flexDirection: 'row', gap: 4 },
  dayCellOuter: { flex: 1, alignItems: 'center' },
  dayCellClip: { width: 40, height: 48, borderRadius: 14, overflow: 'hidden' as const },
  dayCellInner: { width: 40, height: 48, alignItems: 'center', justifyContent: 'center' },
  dayCellBg: { width: 40, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  dayNum: { fontSize: 14, marginBottom: 2 },
  dayDot: { width: 6, height: 6, borderRadius: 3 },
  habitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  habitHeaderTitle: { fontSize: 17, fontWeight: '600' },
  habitHeaderCount: { fontSize: 14, color: '#9CA3AF' },
  habitRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12, backgroundColor: 'transparent' },
  swipeAction: {
    width: 90, justifyContent: 'center', alignItems: 'center',
    flexDirection: 'row', gap: 6, borderRadius: 12, marginVertical: 4,
  },
  swipeActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  habitInfoTouch: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkboxClip: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' as const },
  checkboxGrad: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  checkmark: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  checkboxEmpty: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(128,128,128,0.3)', alignItems: 'center', justifyContent: 'center' },
  playClip: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' as const },
  playGrad: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  playMark: { color: '#FFF', fontSize: 14, fontWeight: '700', marginLeft: 2 },
  habitEmoji: { fontSize: 20 },
  habitInfo: { flex: 1, gap: 2 },
  habitTitle: { fontSize: 14, fontWeight: '500' },
  habitMeta: { flexDirection: 'row', gap: 6 },
  habitMetaText: { fontSize: 11, color: '#9CA3AF' },
  emptyText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', paddingVertical: 20 },
  expandBtn: { alignItems: 'center', paddingVertical: 8 },
  expandIcon: { fontSize: 14, color: '#9CA3AF' },
  quickRow: { flexDirection: 'row', gap: 12 },
  quickAction: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', overflow: 'hidden' as const },
  quickGradientText: { color: '#FFF', fontSize: 15, fontWeight: '500' },
  quickInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  quickWhite: { backgroundColor: '#FFF', borderRadius: 14, paddingVertical: 14, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  quickWhiteText: { fontSize: 15, fontWeight: '500' },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryTitle: { fontSize: 17, fontWeight: '600' },
  summaryPercent: { fontSize: 22, fontWeight: '700' },
  progressBg: { height: 12, backgroundColor: 'rgba(156,163,175,0.15)', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: 12, borderRadius: 6 },
});
