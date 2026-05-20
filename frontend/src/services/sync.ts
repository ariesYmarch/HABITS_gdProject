/**
 * SyncManager: Local-First + Server Backup 양방향 동기화.
 *
 * 흐름:
 *   1) pull: 서버에서 변경된 데이터 받아 LWW로 로컬 머지
 *   2) push: 로컬에 있는 데이터 서버로 업로드 (서버측 LWW로 충돌 해결)
 *
 * 트리거 (RootNavigator나 컴포넌트에서 호출):
 *   - 로그인 직후 pull (전체)
 *   - 앱 포그라운드 진입 시 sync (since=lastSyncedAt)
 *   - 데이터 변경 후 debounce push
 */
import api from './api';
import { useAppStore } from '../store';
import { Habit, HabitFrequency } from '../types/habit';
import { DiaryEntry } from '../types/diary';

interface PullResponse {
  server_time: string;
  habits: Array<{
    server_id: number;
    client_id: string;
    title: string;
    emoji: string;
    hashtags: string[];
    category?: string | null;
    frequency: HabitFrequency;
    time_slot: string;
    duration: number;
    is_active: boolean;
    deactivated_at?: string | null;
    deleted_at?: string | null;
    updated_at: string;
  }>;
  habit_logs: Array<{
    habit_client_id: string;
    date: string;
    is_completed: boolean;
    updated_at: string;
  }>;
  diaries: Array<{
    server_id: number;
    client_id: string;
    date: string;
    mood_score?: number | null;
    emotion_tags: string[];
    text_content?: string | null;
    deleted_at?: string | null;
    updated_at: string;
  }>;
  emotion_analyses: Array<{
    diary_client_id: string;
    main_emotion?: string | null;
    confidence?: number | null;
    distribution?: Record<string, number> | null;
    sentiment?: number | null;
    analyzed_at: string;
  }>;
}

interface PushResponse {
  synced_at: string;
  conflicts: Array<{
    entity: string;
    client_id: string;
    server_updated_at: string;
    client_updated_at: string;
  }>;
}

const STORAGE_KEY_LAST_SYNC = '__sync_lastSyncedAt';

function getLastSyncedAt(): string | null {
  try {
    const raw = require('@react-native-async-storage/async-storage');
    // sync 함수 내에서 직접 접근하기 어려우니 zustand에 저장하는 게 더 단순함
    // 일단 메모리만 사용
    return (globalThis as any).__sync_lastSyncedAt || null;
  } catch {
    return null;
  }
}

function setLastSyncedAt(iso: string): void {
  (globalThis as any).__sync_lastSyncedAt = iso;
}

/**
 * 서버 → 로컬: 변경된 데이터 받아서 LWW 머지.
 */
export async function pullSync(): Promise<void> {
  const since = getLastSyncedAt();
  const params = since ? { since } : {};

  const res = await api.get<PullResponse>('/api/v1/sync/pull', { params });
  const data = res.data;

  // habit_logs와 emotion_analyses를 habit/diary와 합쳐서 로컬 형태로 변환
  const habitLogsByClientId = new Map<string, Record<string, boolean>>();
  for (const log of data.habit_logs) {
    if (!log.is_completed) continue;
    const map = habitLogsByClientId.get(log.habit_client_id) || {};
    map[log.date] = true;
    habitLogsByClientId.set(log.habit_client_id, map);
  }

  const habits: Habit[] = data.habits.map((h) => ({
    id: h.client_id,
    title: h.title,
    emoji: h.emoji,
    hashtags: h.hashtags,
    frequency: h.frequency,
    timeSlot: h.time_slot as any,
    duration: h.duration,
    completionHistory: habitLogsByClientId.get(h.client_id) || {},
    isActive: h.is_active,
    createdDate: h.updated_at,  // 서버에서 별도 필드 없으면 updated_at 사용
    deactivatedDate: h.deactivated_at || undefined,
    updatedAt: h.updated_at,
    deletedAt: h.deleted_at || undefined,
  }));

  const emotionByDiaryClientId = new Map<string, any>();
  for (const ea of data.emotion_analyses) {
    if (ea.main_emotion && ea.distribution) {
      emotionByDiaryClientId.set(ea.diary_client_id, {
        mainEmotion: ea.main_emotion,
        confidence: ea.confidence || 0,
        distribution: ea.distribution,
        analyzedAt: ea.analyzed_at,
      });
    }
  }

  const diaries: DiaryEntry[] = data.diaries.map((d) => ({
    id: d.client_id,
    date: d.date,
    moodScore: d.mood_score ?? 0,
    emotionTags: d.emotion_tags,
    textContent: d.text_content || undefined,
    emotionAnalysis: emotionByDiaryClientId.get(d.client_id),
    updatedAt: d.updated_at,
    deletedAt: d.deleted_at || undefined,
  }));

  const store = useAppStore.getState();
  store.upsertHabits(habits);
  store.upsertDiaries(diaries);

  setLastSyncedAt(data.server_time);
}

/**
 * 로컬 → 서버: 모든 로컬 데이터를 보냄. 서버측 LWW로 충돌 해결.
 * (성능 최적화 시 마지막 sync 이후 변경된 것만 보내도록 개선 가능)
 */
export async function pushSync(): Promise<PushResponse> {
  const state = useAppStore.getState();
  const habits = state.habits;
  const diaries = state.diaryEntries;

  // habits 매핑
  const habitsPayload = habits.map((h) => ({
    client_id: h.id,
    title: h.title,
    emoji: h.emoji,
    hashtags: h.hashtags,
    frequency: h.frequency,
    time_slot: h.timeSlot,
    duration: h.duration,
    is_active: h.isActive,
    deactivated_at: h.deactivatedDate || null,
    deleted_at: h.deletedAt || null,
    updated_at: h.updatedAt || new Date().toISOString(),
  }));

  // habit_logs 매핑 (completionHistory를 평탄화)
  const logsPayload: Array<{
    habit_client_id: string;
    date: string;
    is_completed: boolean;
    updated_at: string;
  }> = [];
  for (const h of habits) {
    for (const [date, completed] of Object.entries(h.completionHistory)) {
      if (completed) {
        logsPayload.push({
          habit_client_id: h.id,
          date,
          is_completed: true,
          updated_at: h.updatedAt || new Date().toISOString(),
        });
      }
    }
  }

  // diaries 매핑 (emotionAnalysis 있으면 함께 전송 → 백엔드 EmotionAnalysis 테이블에 upsert)
  const diariesPayload = diaries.map((d) => ({
    client_id: d.id,
    date: d.date,
    mood_score: d.moodScore,
    emotion_tags: d.emotionTags,
    text_content: d.textContent || null,
    emotion_analysis: d.emotionAnalysis ? {
      main_emotion: d.emotionAnalysis.mainEmotion,
      confidence: d.emotionAnalysis.confidence,
      distribution: d.emotionAnalysis.distribution,
      analyzed_at: d.emotionAnalysis.analyzedAt,
    } : null,
    deleted_at: d.deletedAt || null,
    updated_at: d.updatedAt || new Date().toISOString(),
  }));

  // personality_results: zustand에 저장된 current/ideal 메타 → 백엔드 PersonalityResult 테이블로
  const personalityPayload: Array<{
    client_id: string;
    test_type: string;
    type_id: number;
    type_name: string | null;
    hashtags: string[];
    tested_at: string;
    updated_at: string;
  }> = [];
  const { personalityCurrent, personalityIdeal } = state;
  if (personalityCurrent) {
    personalityPayload.push({
      client_id: personalityCurrent.clientId,
      test_type: 'current',
      type_id: personalityCurrent.typeId,
      type_name: null,
      hashtags: personalityCurrent.hashtags,
      tested_at: personalityCurrent.testedAt,
      updated_at: personalityCurrent.updatedAt,
    });
  }
  if (personalityIdeal) {
    personalityPayload.push({
      client_id: personalityIdeal.clientId,
      test_type: 'ideal',
      type_id: personalityIdeal.typeId,
      type_name: null,
      hashtags: personalityIdeal.hashtags,
      tested_at: personalityIdeal.testedAt,
      updated_at: personalityIdeal.updatedAt,
    });
  }

  const res = await api.post<PushResponse>('/api/v1/sync/push', {
    habits: habitsPayload,
    habit_logs: logsPayload,
    diaries: diariesPayload,
    personality_results: personalityPayload,
  });

  setLastSyncedAt(res.data.synced_at);
  return res.data;
}

/**
 * 양방향 sync: pull → push.
 * push 먼저 하면 같은 데이터에 대한 conflict가 생길 수 있어 pull부터.
 */
export async function fullSync(): Promise<void> {
  await pullSync();
  await pushSync();
}

/**
 * 디바운스 push: 변경 발생 시 5초 후 push (연속 변경은 1번만 sync).
 */
let pushTimer: ReturnType<typeof setTimeout> | null = null;

export function schedulePush(delayMs: number = 5000): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    pushSync().catch((e) => {
      console.warn('[sync] push 실패:', e?.message || e);
    });
  }, delayMs);
}
