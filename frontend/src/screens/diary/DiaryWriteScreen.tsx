import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import type { DiaryEntry, EmotionType } from '../../types/diary';
import { EMOTION_EMOJIS, EMOTION_LABELS } from '../../data/emotionKeywords';
import api from '../../services/api';
import { schedulePush } from '../../services/sync';

const EMOTION_KEYS: EmotionType[] = ['joy', 'calm', 'proud', 'hope', 'sadness', 'anger', 'anxiety', 'fatigue'];

function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getTodayString(): string {
  const d = new Date();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdays[d.getDay()]})`;
}

function getMoodText(score: number): string {
  if (score < 0.2) return '많이 힘들었어요 😢';
  if (score < 0.4) return '조금 별로였어요';
  if (score < 0.6) return '괜찮았어요';
  if (score < 0.8) return '꽤 좋았어요!';
  return '너무 좋았어요! 🎉';
}

function getMoodEmoji(score: number): string {
  if (score < 0.2) return '😢';
  if (score < 0.4) return '😔';
  if (score < 0.6) return '😐';
  if (score < 0.8) return '🙂';
  return '😊';
}

export function DiaryWriteScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const addDiaryEntry = useAppStore((s) => s.addDiaryEntry);
  const updateDiaryEntry = useAppStore((s) => s.updateDiaryEntry);
  const diaryEntries = useAppStore((s) => s.diaryEntries);
  const userName = useAppStore((s) => s.userName);

  const todayStr = formatDateString(new Date());
  const existingEntry = diaryEntries.find((e) => e.date === todayStr);

  const [moodScore, setMoodScore] = useState(0.5);
  const [textContent, setTextContent] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionType[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // 화면 포커스될 때마다 초기화
  useFocusEffect(
    useCallback(() => {
      setMoodScore(0.5);
      setTextContent('');
      setSelectedEmotions([]);
      setIsSaved(false);
    }, []),
  );

  const canSave = true; // 슬라이더는 항상 값이 있으므로 항상 저장 가능

  const handleSave = useCallback(() => {
    const text = textContent.trim();
    const entry: Omit<DiaryEntry, 'id'> = {
      date: todayStr,
      moodScore: moodScore * 2 - 1, // 0~1 → -1~1 범위
      emotionTags: selectedEmotions,
      textContent: text || undefined,
    };

    const newId = addDiaryEntry(entry);
    setIsSaved(true);
    schedulePush();   // 백엔드로 자동 동기화 (5초 debounce)
    Alert.alert('저장 완료', '오늘의 일기가 저장되었어요! ✨', [
      { text: '확인', onPress: () => navigation.goBack() },
    ]);

    // 감정 분석 결과 저장:
    // 1) 텍스트 있으면 KoELECTRA + 키워드 분석 시도
    // 2) 분석 결과가 비거나 텍스트 없어도 → 사용자 버튼 입력(selectedEmotions)으로 fallback
    const ensureAnalysis = async () => {
      let scores: Record<string, number> = {};

      if (text) {
        try {
          const res = await api.post('/api/v1/emotion/analyze', { text });
          scores = res.data?.scores || {};
        } catch {
          // 호출 실패 → 아래 fallback 사용
        }
      }

      // 분석 결과 비었으면 버튼 입력으로 synthetic distribution 생성
      if (Object.keys(scores).length === 0 && selectedEmotions.length > 0) {
        const w = 1 / selectedEmotions.length;
        for (const e of selectedEmotions) scores[e] = w;
      }

      if (Object.keys(scores).length === 0) return;   // 정말 아무 정보도 없음

      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      updateDiaryEntry(newId, {
        emotionAnalysis: {
          mainEmotion: sorted[0][0] as any,
          confidence: sorted[0][1],
          distribution: scores as any,
          analyzedAt: new Date().toISOString(),
        },
      });
      schedulePush();
    };
    ensureAnalysis();
  }, [
    todayStr,
    moodScore,
    textContent,
    selectedEmotions,
    addDiaryEntry,
    updateDiaryEntry,
  ]);

  return (
    <View
      style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dateTitle, { color: theme.textPrimary }]}>
                {getTodayString()}
              </Text>
              <Text
                style={[styles.subtitle, { color: theme.textSecondary }]}>
                오늘 하루는 어땠나요?
              </Text>
            </View>
          </View>

          {/* Section 1: Mood Score */}
          <View style={styles.card}>
            <Text style={styles.moodEmoji}>{getMoodEmoji(moodScore)}</Text>
            <Text
              style={[styles.moodText, { color: theme.primaryColor }]}>
              {getMoodText(moodScore)}
            </Text>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderEmoji}>😢</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={moodScore}
                onValueChange={(v) => {
                  setMoodScore(v);
                  setIsSaved(false);
                }}
                minimumTrackTintColor={theme.primaryColor}
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor={theme.primaryColor}
              />
              <Text style={styles.sliderEmoji}>😊</Text>
            </View>
            <View style={styles.emotionGrid}>
              {EMOTION_KEYS.map((key) => {
                const selected = selectedEmotions.includes(key);
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.emotionChip, { backgroundColor: selected ? theme.primaryColor : theme.primaryColor + '14' }]}
                    onPress={() => {
                      setSelectedEmotions((prev) =>
                        prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key],
                      );
                      setIsSaved(false);
                    }}
                    activeOpacity={0.7}>
                    <Text style={styles.emotionChipEmoji}>{EMOTION_EMOJIS[key]}</Text>
                    <Text style={[styles.emotionChipLabel, { color: selected ? '#FFF' : theme.textPrimary }]}>{EMOTION_LABELS[key]}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 2: Diary Text */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                직접 일기 쓰기
              </Text>
            </View>
            <View
              style={[
                styles.textInputContainer,
                { backgroundColor: theme.primaryColor + '0D' },
              ]}>
              <TextInput
                style={[styles.textInput, { color: theme.textPrimary }]}
                placeholder={`일기를 쓰고 쓰지 않고는 ${userName || '회원'}님의 선택이에요 :)`}
                placeholderTextColor={'#9CA3AF80'}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={textContent}
                onChangeText={(text) => {
                  setTextContent(text);
                  setIsSaved(false);
                }}
              />
            </View>
          </View>

          {/* Save Button - 앱 전반 주 액션 버튼과 동일한 그라데이션 */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave || isSaved}
            activeOpacity={0.85}
            style={styles.saveButton}>
            <LinearGradient
              colors={isSaved
                ? ['#9CA3AF', '#9CA3AF']
                : canSave
                  ? [theme.gradientColors[1], theme.gradientColors[2]]
                  : ['#C8CDD5', '#C8CDD5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.saveButtonText}>
              {isSaved ? '저장됨 ✓' : '저장하기'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40, gap: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  dateTitle: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 15, marginTop: 4 },
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
  moodEmoji: { fontSize: 60, textAlign: 'center', marginBottom: 8 },
  moodText: { fontSize: 17, fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sliderEmoji: { fontSize: 20 },
  slider: { flex: 1 },
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  emotionChip: { width: '22.5%' as any, alignItems: 'center', paddingVertical: 10, borderRadius: 12, gap: 4, flexGrow: 1, flexBasis: '22%' as any },
  emotionChipEmoji: { fontSize: 20 },
  emotionChipLabel: { fontSize: 11, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800' },
  sectionCaption2: { fontSize: 12, marginTop: 4, marginBottom: 12 },
  textInputContainer: { borderRadius: 12, overflow: 'hidden' },
  textInput: { fontSize: 15, padding: 12, minHeight: 100, lineHeight: 22 },
  satisfactionRow: { flexDirection: 'row', gap: 10 },
  satisfactionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 6,
  },
  satisfactionEmoji: { fontSize: 26 },
  satisfactionLabel: { fontSize: 13 },
  saveButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    overflow: 'hidden' as const,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
});
