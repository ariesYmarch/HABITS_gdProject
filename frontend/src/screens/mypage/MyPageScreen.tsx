import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppStore } from '../../store';
import { themes, ThemeId } from '../../theme/themes';
import { findPersonalityType } from '../../data/personalityTypes';

interface SettingsRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  textPrimary: string;
  textSecondary: string;
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  danger,
  textPrimary,
  textSecondary,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingsRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      disabled={!onPress}>
      <Text style={styles.settingsIcon}>{icon}</Text>
      <Text
        style={[
          styles.settingsLabel,
          { color: danger ? '#EF4444' : textPrimary },
        ]}>
        {label}
      </Text>
      {value ? (
        <Text style={[styles.settingsValue, { color: textSecondary }]}>
          {value}
        </Text>
      ) : onPress ? (
        <Text style={[styles.settingsArrow, { color: textSecondary }]}>
          →
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

export function MyPageScreen() {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const setTheme = useAppStore((s) => s.setTheme);

  const userName = useAppStore((s) => s.userName);
  const userIcon = useAppStore((s) => s.userIcon);
  const personalityTypeId = useAppStore((s) => s.personalityTypeId);
  const idealPersonalityTypeId = useAppStore((s) => s.idealPersonalityTypeId);
  const occupation = useAppStore((s) => s.occupation);
  const selectedHashtags = useAppStore((s) => s.selectedHashtags);
  const habits = useAppStore((s) => s.habits);
  const diaryEntries = useAppStore((s) => s.diaryEntries);

  const resetUser = useAppStore((s) => s.resetUser);
  const resetHabits = useAppStore((s) => s.resetHabits);
  const resetDiary = useAppStore((s) => s.resetDiary);
  const resetSchedule = useAppStore((s) => s.resetSchedule);

  const currentType = personalityTypeId
    ? findPersonalityType(personalityTypeId)
    : null;
  const idealType = idealPersonalityTypeId
    ? findPersonalityType(idealPersonalityTypeId)
    : null;

  const activeHabitsCount = habits.filter((h) => h.isActive).length;

  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleReset = useCallback(() => {
    Alert.alert(
      '데이터 초기화',
      '모든 데이터(습관, 일기, 설정)가 삭제됩니다.\n이 작업은 되돌릴 수 없어요.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '초기화',
          style: 'destructive',
          onPress: () => {
            resetUser();
            resetHabits();
            resetDiary();
            resetSchedule();
            Alert.alert('초기화 완료', '모든 데이터가 초기화되었어요.');
          },
        },
      ],
    );
  }, [resetUser, resetHabits, resetDiary, resetSchedule]);

  const themeOptions = Object.values(themes);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <LinearGradient
          colors={theme.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileIcon}>{userIcon}</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {userName || '사용자'}님
              </Text>
              <Text style={styles.profileOccupation}>{occupation}</Text>
            </View>
          </View>

          {/* Personality types */}
          {(currentType || idealType) && (
            <View style={styles.personalityRow}>
              {currentType && (
                <View style={styles.personalityBadge}>
                  <Text style={styles.personalityEmoji}>
                    {currentType.emoji}
                  </Text>
                  <View>
                    <Text style={styles.personalityLabel}>현재 성향</Text>
                    <Text style={styles.personalityName}>
                      {currentType.nameKR}
                    </Text>
                  </View>
                </View>
              )}
              {idealType && (
                <View style={styles.personalityBadge}>
                  <Text style={styles.personalityEmoji}>
                    {idealType.emoji}
                  </Text>
                  <View>
                    <Text style={styles.personalityLabel}>이상 성향</Text>
                    <Text style={styles.personalityName}>
                      {idealType.nameKR}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{activeHabitsCount}</Text>
              <Text style={styles.statLabel}>활성 습관</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{diaryEntries.length}</Text>
              <Text style={styles.statLabel}>일기 수</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {selectedHashtags.length}
              </Text>
              <Text style={styles.statLabel}>해시태그</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Selected Hashtags */}
        {selectedHashtags.length > 0 && (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.cardBackgroundColor },
            ]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
              내 해시태그
            </Text>
            <View style={styles.tagsRow}>
              {selectedHashtags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tagChip,
                    { backgroundColor: theme.primaryColor + '15' },
                  ]}>
                  <Text
                    style={[
                      styles.tagChipText,
                      { color: theme.primaryColor },
                    ]}>
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Theme Settings */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackgroundColor },
          ]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            테마 설정
          </Text>
          <View style={styles.themeGrid}>
            {themeOptions.map((t) => {
              const isActive = t.id === themeId;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.themeOption,
                    isActive && {
                      borderColor: t.primaryColor,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => setTheme(t.id)}
                  activeOpacity={0.7}>
                  <LinearGradient
                    colors={t.gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.themePreview}
                  />
                  <Text style={styles.themeEmoji}>{t.emoji}</Text>
                  <Text
                    style={[
                      styles.themeName,
                      {
                        color: isActive ? t.primaryColor : theme.textSecondary,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}>
                    {t.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Settings List */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackgroundColor },
          ]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            앱 정보
          </Text>
          <SettingsRow
            icon="📱"
            label="앱 버전"
            value="1.0.0"
            textPrimary={theme.textPrimary}
            textSecondary={theme.textSecondary}
          />
          <SettingsRow
            icon="🎯"
            label="활성 습관"
            value={`${activeHabitsCount}개`}
            textPrimary={theme.textPrimary}
            textSecondary={theme.textSecondary}
          />
          <SettingsRow
            icon="📔"
            label="작성한 일기"
            value={`${diaryEntries.length}개`}
            textPrimary={theme.textPrimary}
            textSecondary={theme.textSecondary}
          />
        </View>

        {/* Danger Zone */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackgroundColor },
          ]}>
          <SettingsRow
            icon="🗑️"
            label="데이터 초기화"
            onPress={handleReset}
            danger
            textPrimary={theme.textPrimary}
            textSecondary={theme.textSecondary}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            HABITS - 심리학 기반 맞춤 습관 코칭 서비스
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  profileIcon: {
    fontSize: 48,
    backgroundColor: 'rgba(255,255,255,0.25)',
    width: 72,
    height: 72,
    lineHeight: 72,
    textAlign: 'center',
    borderRadius: 36,
    overflow: 'hidden',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  profileOccupation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  personalityRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  personalityBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 10,
  },
  personalityEmoji: {
    fontSize: 24,
  },
  personalityLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  personalityName: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingVertical: 14,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  themeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 14,
    padding: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themePreview: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    marginBottom: 8,
  },
  themeEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  themeName: {
    fontSize: 12,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  settingsIcon: {
    fontSize: 20,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  settingsValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingsArrow: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '400',
  },
});
