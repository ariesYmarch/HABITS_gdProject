import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types/navigation';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

type Props = NativeStackScreenProps<MainStackParamList, 'HabitTimer'>;

function fmtDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const RING_SIZE = 280;
const RING_STROKE = 14;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function HabitTimerScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const habits = useAppStore((s) => s.habits);
  const toggleHabitCompletion = useAppStore((s) => s.toggleHabitCompletion);

  const habit = habits.find((h) => h.id === route.params.habitId);
  const totalSeconds = (habit?.duration || 15) * 60;

  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(true);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  // habit 변경 시 리셋
  useEffect(() => {
    if (habit) {
      setRemaining(habit.duration * 60);
      setCompleted(false);
      completedRef.current = false;
      setRunning(true);
    }
  }, [habit]);

  // 타이머 동작 (setRemaining만 호출, complete는 별도 effect에서)
  useEffect(() => {
    if (!running || completed) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, completed]);

  // remaining===0 감지 → 완료 처리 (안티패턴 회피)
  useEffect(() => {
    if (remaining === 0 && !completedRef.current && habit) {
      completedRef.current = true;
      setCompleted(true);
      setRunning(false);
      // 완료 체크는 next tick으로 (다른 컴포넌트 update 중 setState 회피)
      setTimeout(() => {
        toggleHabitCompletion(habit.id, fmtDate(new Date()));
      }, 0);
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }
  }, [remaining, habit, toggleHabitCompletion, navigation]);

  const handleManualComplete = () => {
    if (!habit || completedRef.current) return;
    completedRef.current = true;
    setCompleted(true);
    setRunning(false);
    setTimeout(() => {
      toggleHabitCompletion(habit.id, fmtDate(new Date()));
    }, 0);
    setTimeout(() => navigation.goBack(), 1500);
  };

  const handleCancel = () => {
    Alert.alert(
      '타이머 종료',
      '진행 중인 타이머를 종료할까요?\n완료 처리되지 않습니다.',
      [
        { text: '계속 진행', style: 'cancel' },
        { text: '종료', style: 'destructive', onPress: () => navigation.goBack() },
      ],
    );
  };

  const handleMinimize = () => {
    // 단순 닫기로 처리 (백그라운드 타이머는 V2 작업)
    navigation.goBack();
  };

  if (!habit) {
    return (
      <View style={[s.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top }]}>
        <Text style={[s.errorText, { color: theme.textPrimary }]}>습관을 찾을 수 없어요</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[s.errorBtn, { color: theme.primaryColor }]}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = remaining / totalSeconds;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <View style={s.container}>
      <LinearGradient
        colors={completed ? ['#34C759', '#2ECC71'] : theme.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 상단 바: 작게 보기(텍스트) + 닫기 */}
      <View style={[s.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={handleMinimize} style={s.minimizeBtn}>
          <Text style={s.minimizeBtnText}>작게 보기</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleCancel} style={s.topBtn}>
          <Text style={s.topBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* 본문 */}
      <View style={s.content}>
        {completed ? (
          <View style={s.completedBox}>
            <Text style={s.completedMark}>✓</Text>
            <Text style={s.completedText}>완료!</Text>
            <Text style={s.habitTitle}>{habit.emoji} {habit.title}</Text>
          </View>
        ) : (
          <>
            {/* 링 + 가운데 시간 */}
            <View style={s.ringWrap}>
              <Svg width={RING_SIZE} height={RING_SIZE}>
                <Defs>
                  <SvgGrad id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.4" />
                    <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.15" />
                  </SvgGrad>
                </Defs>
                {/* 배경 링 */}
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  stroke="url(#ringGrad)"
                  strokeWidth={RING_STROKE}
                  fill="none"
                />
                {/* 진행 링 (위에서부터 시계 방향) */}
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  stroke="#FFFFFF"
                  strokeWidth={RING_STROKE}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                />
              </Svg>

              <View style={s.ringInner} pointerEvents="none">
                <Text style={s.timer}>{formatTime(remaining)}</Text>
                <Text style={s.totalLabel}>{habit.duration}분 중</Text>
              </View>
            </View>

            {/* 라벨 (링 아래) - 이모지 + 제목 */}
            <Text style={s.habitTitle}>{habit.emoji} {habit.title}</Text>
          </>
        )}
      </View>

      {/* 하단 컨트롤 */}
      {!completed && (
        <View style={[s.bottomBar, { paddingBottom: insets.bottom + 24 }]}>
          <TouchableOpacity
            onPress={() => setRunning((r) => !r)}
            style={s.controlBtn}
          >
            <Text style={s.controlBtnText}>{running ? '일시정지' : '재개'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleManualComplete}
            style={[s.controlBtn, s.primaryBtn]}
          >
            <Text style={[s.controlBtnText, { color: '#FFF' }]}>완료</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', paddingHorizontal: 16 },
  minimizeBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  minimizeBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  topBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  topBtnText: { color: '#FFF', fontSize: 22, fontWeight: '700' },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
  },
  emoji: { fontSize: 48, marginBottom: 24 },
  ringWrap: {
    width: RING_SIZE, height: RING_SIZE,
    alignItems: 'center', justifyContent: 'center',
  },
  ringInner: {
    position: 'absolute', alignItems: 'center', justifyContent: 'center',
  },
  timer: { fontSize: 64, fontWeight: '300', color: '#FFF', letterSpacing: 1 },
  totalLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  habitTitle: { fontSize: 22, fontWeight: '700', color: '#FFF', textAlign: 'center', marginTop: 28 },
  completedBox: { alignItems: 'center' },
  completedMark: { fontSize: 120, color: '#FFF', marginBottom: 8 },
  completedText: { fontSize: 32, fontWeight: '700', color: '#FFF', marginBottom: 16 },
  bottomBar: {
    flexDirection: 'row', paddingHorizontal: 20, gap: 12,
  },
  controlBtn: {
    flex: 1, paddingVertical: 16, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
  },
  primaryBtn: { backgroundColor: 'rgba(0,0,0,0.25)' },
  controlBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  errorText: { fontSize: 16, marginBottom: 12 },
  errorBtn: { fontSize: 14, fontWeight: '700' },
});
