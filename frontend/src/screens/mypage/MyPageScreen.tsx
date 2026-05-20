import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Pencil } from 'lucide-react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { allHashtags, findPersonalityType } from '../../data/personalityTypes';
import type { Habit } from '../../types/habit';
import { PersonalityRetestCard } from '../../components/personality/PersonalityRetestCard';

/* ─── Settings Row ─── */
function SettingsRow({
  icon,
  title,
  onPress,
  danger,
  primaryColor,
}: {
  icon: string;
  title: string;
  onPress?: () => void;
  danger?: boolean;
  primaryColor: string;
}) {
  return (
    <TouchableOpacity
      style={st.settingsRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      disabled={!onPress}>
      <Text style={[st.settingsIcon, { color: danger ? '#EF4444' : primaryColor }]}>
        {icon}
      </Text>
      <Text style={[st.settingsTitle, { color: danger ? '#EF4444' : '#1C1C1E' }]}>
        {title}
      </Text>
      <Text style={st.settingsChevron}>›</Text>
    </TouchableOpacity>
  );
}

export function MyPageScreen() {
  const insets = useSafeAreaInsets();
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  const userName = useAppStore((s) => s.userName);
  const userIcon = useAppStore((s) => s.userIcon);
  const selectedHashtags = useAppStore((s) => s.selectedHashtags);
  const habits = useAppStore((s) => s.habits);

  const resetUser = useAppStore((s) => s.resetUser);
  const resetHabits = useAppStore((s) => s.resetHabits);
  const resetDiary = useAppStore((s) => s.resetDiary);
  const resetSchedule = useAppStore((s) => s.resetSchedule);
  const logout = useAppStore((s) => s.logout);
  const accessToken = useAppStore((s) => s.accessToken);
  const userEmail = useAppStore((s) => s.user?.email);

  const personalityTypeId = useAppStore((s) => s.personalityTypeId);
  const idealPersonalityTypeId = useAppStore((s) => s.idealPersonalityTypeId);
  const setUserName = useAppStore((s) => s.setUserName);
  const setUserIcon = useAppStore((s) => s.setUserIcon);
  const setSelectedHashtags = useAppStore((s) => s.setSelectedHashtags);

  const currentType = personalityTypeId ? findPersonalityType(personalityTypeId) : null;
  const idealType = idealPersonalityTypeId ? findPersonalityType(idealPersonalityTypeId) : null;

  const myHabitTags = Array.from(selectedHashtags);

  /* ─── Tag → Habits Modal ─── */
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const habitsForTag = useMemo(() => {
    if (!selectedTag) return [];
    return habits.filter((h) => h.hashtags.includes(selectedTag));
  }, [selectedTag, habits]);

  /* ─── Profile Edit Modal ─── */
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editName, setEditName] = useState(userName || '');
  const [editIcon, setEditIcon] = useState(userIcon || '😀');
  const iconOptions = ['😀', '😎', '🤗', '🦊', '🐻', '🐶', '🌟', '🌈', '🍀', '🔥', '💪', '🎯'];

  const handleProfileSave = () => {
    if (editName.trim()) setUserName(editName.trim());
    setUserIcon(editIcon);
    setShowProfileEdit(false);
  };

  const openProfileEdit = () => {
    setEditName(userName || '');
    setEditIcon(userIcon || '😀');
    setShowProfileEdit(true);
  };

  /* ─── Tag Edit Modal ─── */
  const [showTagEdit, setShowTagEdit] = useState(false);
  const [editTags, setEditTags] = useState<Set<string>>(new Set(selectedHashtags));

  const openTagEdit = () => {
    setEditTags(new Set(selectedHashtags));
    setShowTagEdit(true);
  };
  const toggleEditTag = (tag: string) => {
    setEditTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };
  const handleTagSave = () => {
    setSelectedHashtags(Array.from(editTags));
    setShowTagEdit(false);
  };

  const handleLogout = useCallback(() => {
    Alert.alert(
      '로그아웃',
      '로그아웃하면 다시 로그인해야 합니다.\n다음 로그인 시 서버에서 데이터를 다시 불러옵니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
    );
  }, [logout]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      '회원 탈퇴',
      '계정과 서버에 저장된 모든 데이터가 즉시 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '정말 탈퇴하시겠습니까?',
              `${userEmail || '이 계정'}으로 가입된 데이터가 영구 삭제됩니다.`,
              [
                { text: '취소', style: 'cancel' },
                {
                  text: '확인',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      const api = require('../../services/api').default;
                      await api.delete('/api/v1/auth/account', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      });
                    } catch (e) {
                      // 서버 호출 실패해도 로컬은 정리
                    }
                    resetUser();
                    resetHabits();
                    resetDiary();
                    resetSchedule();
                    await logout();
                    Alert.alert('탈퇴 완료', '이용해주셔서 감사합니다.');
                  },
                },
              ],
            );
          },
        },
      ],
    );
  }, [accessToken, userEmail, logout, resetUser, resetHabits, resetDiary, resetSchedule]);

  const handleReset = useCallback(() => {
    Alert.alert(
      '앱을 초기화하시겠습니까?',
      '초기화 전 한 번 더 확인합니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '계속',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '정말 초기화하시겠습니까?',
              '초기화하면 모든 습관 기록, 일기, 설정이 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.',
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
          },
        },
      ],
    );
  }, [resetUser, resetHabits, resetDiary, resetSchedule]);

  return (
    <View
      style={[st.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView
        contentContainerStyle={[st.scrollContent, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={st.card}>
          <View style={st.profileCenter}>
            <LinearGradient
              colors={theme.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={st.profileCircle}>
              <Text style={st.profileIconText}>{userIcon}</Text>
            </LinearGradient>
            <Text style={[st.profileName, { color: theme.textPrimary }]}>
              {userName || '사용자'}
            </Text>
            <TouchableOpacity
              style={[
                st.editProfileBtn,
                {
                  backgroundColor: theme.primaryColor + '1A',
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                },
              ]}
              activeOpacity={0.7}
              onPress={openProfileEdit}>
              <Pencil size={14} color={theme.primaryColor} />
              <Text style={[st.editProfileText, { color: theme.primaryColor }]}>
                프로필 수정
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personality Result Section */}
        {(currentType || idealType) && (
          <View style={st.card}>
            <Text style={[st.sectionTitle, { color: theme.textPrimary, marginBottom: 12 }]}>
              성격 유형 분석 결과
            </Text>
            {currentType && (
              <View>
                <View style={st.personalityRow}>
                  <View style={[st.personalityBadge, { backgroundColor: theme.primaryColor + '20' }]}>
                    <Text style={st.personalityEmoji}>{currentType.emoji}</Text>
                  </View>
                  <View style={st.personalityInfo}>
                    <Text style={[st.personalityLabel, { color: theme.textSecondary }]}>현재의 나</Text>
                    <Text style={[st.personalityName, { color: theme.textPrimary }]}>{currentType.nameKR}</Text>
                  </View>
                </View>
                <View style={st.personalityTags}>
                  {currentType.hashtags.map((t) => (
                    <Text key={t} style={[st.personalityTagText, { color: theme.primaryColor }]}>{t}</Text>
                  ))}
                </View>
              </View>
            )}
            {idealType && (
              <View style={{ marginTop: 16 }}>
                <View style={st.personalityRow}>
                  <View style={[st.personalityBadge, { backgroundColor: theme.primaryColor + '20' }]}>
                    <Text style={st.personalityEmoji}>{idealType.emoji}</Text>
                  </View>
                  <View style={st.personalityInfo}>
                    <Text style={[st.personalityLabel, { color: theme.textSecondary }]}>이상적인 나</Text>
                    <Text style={[st.personalityName, { color: theme.textPrimary }]}>{idealType.nameKR}</Text>
                  </View>
                </View>
                <View style={st.personalityTags}>
                  {idealType.hashtags.map((t) => (
                    <Text key={t} style={[st.personalityTagText, { color: theme.primaryColor }]}>{t}</Text>
                  ))}
                </View>
              </View>
            )}

            {/* 재검사 카드 */}
            <View style={{ marginTop: 16 }}>
              <PersonalityRetestCard />
            </View>
          </View>
        )}

        {/* Hashtag Section */}
        {myHabitTags.length > 0 && (
          <View style={st.card}>
            <View style={st.sectionHeaderRow}>
              <Text style={[st.sectionTitle, { color: theme.textPrimary }]}>
                나의 목표
              </Text>
            </View>
            <Text style={[st.sectionHint, { color: theme.textSecondary }]}>
              태그를 터치하면 관련 습관을 볼 수 있어요
            </Text>
            <View style={st.tagsRow}>
              {myHabitTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    st.tagChip,
                    { backgroundColor: theme.primaryColor + '26' },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedTag(tag)}>
                  <Text
                    style={[st.tagChipText, { color: theme.primaryColor }]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Settings Section */}
        <View style={st.card}>
          <SettingsRow
            icon="🕐"
            title="일정 설정"
            onPress={() => Alert.alert('준비 중', '일정 설정 기능은 준비 중이에요.')}
            primaryColor={theme.primaryColor}
          />
          <View style={st.divider} />
          <SettingsRow
            icon="🔔"
            title="알림 설정"
            onPress={() => Alert.alert('준비 중', '알림 설정 기능은 준비 중이에요.')}
            primaryColor={theme.primaryColor}
          />
        </View>

        {/* Account Section */}
        <View style={st.card}>
          <SettingsRow
            icon="🚪"
            title="로그아웃"
            onPress={handleLogout}
            primaryColor={theme.primaryColor}
          />
          <View style={st.divider} />
          <SettingsRow
            icon="❌"
            title="회원 탈퇴"
            onPress={handleDeleteAccount}
            danger
            primaryColor={theme.primaryColor}
          />
        </View>

        {/* Danger Zone */}
        <View style={st.card}>
          <SettingsRow
            icon="🔄"
            title="앱 초기화 (로컬만)"
            onPress={handleReset}
            danger
            primaryColor={theme.primaryColor}
          />
        </View>

        {/* Footer */}
        <View style={st.footer}>
          <Text style={[st.footerText, { color: theme.textSecondary }]}>
            HABITS - 심리학 기반 맞춤 습관 코칭 서비스
          </Text>
        </View>
      </ScrollView>

      {/* ─── Tag Habits Modal ─── */}
      <Modal visible={!!selectedTag} transparent animationType="slide" onRequestClose={() => setSelectedTag(null)}>
        <View style={st.modalOverlay}>
          <View style={[st.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <View style={st.modalHeader}>
              <Text style={[st.modalTitle, { color: theme.textPrimary }]}>{selectedTag}</Text>
              <TouchableOpacity onPress={() => setSelectedTag(null)}>
                <Text style={[st.modalClose, { color: theme.primaryColor }]}>닫기</Text>
              </TouchableOpacity>
            </View>
            {habitsForTag.length > 0 ? (
              <ScrollView style={st.modalScroll} showsVerticalScrollIndicator={false}>
                {habitsForTag.map((h) => (
                  <View key={h.id} style={st.habitRow}>
                    <Text style={st.habitEmoji}>{h.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[st.habitTitle, { color: theme.textPrimary }]}>{h.title}</Text>
                      <Text style={[st.habitSub, { color: theme.textSecondary }]}>
                        {h.isActive ? '활성' : '비활성'} · {h.duration}분
                      </Text>
                    </View>
                    <View style={[st.habitStatus, { backgroundColor: h.isActive ? theme.primaryColor + '26' : '#F3F4F6' }]}>
                      <Text style={{ fontSize: 11, color: h.isActive ? theme.primaryColor : '#9CA3AF' }}>
                        {h.isActive ? '실천 중' : '중단'}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={st.emptyContainer}>
                <Text style={[st.emptyText, { color: theme.textSecondary }]}>
                  이 태그에 해당하는 습관이 없어요
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ─── Tag Edit Modal ─── */}
      <Modal visible={showTagEdit} transparent animationType="slide" onRequestClose={() => setShowTagEdit(false)}>
        <View style={st.modalOverlay}>
          <View style={[st.modalContent, { backgroundColor: theme.backgroundColor, maxHeight: '80%' }]}>
            <View style={st.modalHeader}>
              <Text style={[st.modalTitle, { color: theme.textPrimary }]}>나의 목표 수정</Text>
              <TouchableOpacity onPress={() => setShowTagEdit(false)}>
                <Text style={[st.modalClose, { color: theme.primaryColor }]}>취소</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
              <View style={st.editTagGrid}>
                {allHashtags.map((h) => {
                  const isSelected = editTags.has(h.tag);
                  return (
                    <TouchableOpacity
                      key={h.id}
                      style={[st.editTagChip, { backgroundColor: isSelected ? theme.primaryColor : theme.primaryColor + '14' }]}
                      onPress={() => toggleEditTag(h.tag)}
                      activeOpacity={0.7}>
                      <Text style={{ fontSize: 13, color: isSelected ? '#FFF' : theme.textPrimary, fontWeight: isSelected ? '600' : '400' }}>
                        {h.tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            <Text style={[st.editTagCount, { color: theme.textSecondary }]}>{editTags.size}개 선택됨</Text>
            <TouchableOpacity style={[st.saveBtn, { overflow: 'hidden' as any }]} activeOpacity={0.8} onPress={handleTagSave}>
              <LinearGradient colors={theme.gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
              <Text style={st.saveBtnText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─── Profile Edit Modal ─── */}
      <Modal visible={showProfileEdit} transparent animationType="slide" onRequestClose={() => setShowProfileEdit(false)}>
        <View style={st.modalOverlay}>
          <View style={[st.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <View style={st.modalHeader}>
              <Text style={[st.modalTitle, { color: theme.textPrimary }]}>프로필 수정</Text>
              <TouchableOpacity onPress={() => setShowProfileEdit(false)}>
                <Text style={[st.modalClose, { color: theme.primaryColor }]}>취소</Text>
              </TouchableOpacity>
            </View>

            {/* Icon Picker */}
            <Text style={[st.editLabel, { color: theme.textPrimary }]}>프로필 아이콘</Text>
            <View style={st.iconGrid}>
              {iconOptions.map((ico) => (
                <TouchableOpacity
                  key={ico}
                  style={[st.iconOption, editIcon === ico && { backgroundColor: theme.primaryColor + '33', borderColor: theme.primaryColor }]}
                  onPress={() => setEditIcon(ico)}>
                  <Text style={{ fontSize: 28 }}>{ico}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Name Input */}
            <Text style={[st.editLabel, { color: theme.textPrimary, marginTop: 20 }]}>이름</Text>
            <TextInput
              style={[st.nameInput, { color: theme.textPrimary, borderColor: theme.primaryColor + '44' }]}
              value={editName}
              onChangeText={setEditName}
              placeholder="이름을 입력하세요"
              placeholderTextColor={theme.textSecondary}
              maxLength={20}
            />

            {/* Save */}
            <TouchableOpacity
              style={[st.saveBtn, { overflow: 'hidden' as any }]}
              activeOpacity={0.8}
              onPress={handleProfileSave}>
              <LinearGradient colors={theme.gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
              <Text style={st.saveBtnText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const st = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { padding: 20, gap: 24, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  profileCenter: { alignItems: 'center' },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileIconText: { fontSize: 36, color: '#FFFFFF' },
  profileName: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  editProfileBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  editProfileText: { fontSize: 13 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800' },
  editLink: { fontSize: 13 },
  sectionHint: { fontSize: 12, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  tagChipText: { fontSize: 14, fontWeight: '500' },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
    gap: 14,
  },
  settingsIcon: { fontSize: 20, width: 24, textAlign: 'center' },
  settingsTitle: { flex: 1, fontSize: 15, fontWeight: '400' },
  settingsChevron: { fontSize: 18, color: '#9CA3AF' },
  divider: { height: 0.5, backgroundColor: '#F3F4F6', marginLeft: 50 },
  footer: { alignItems: 'center', paddingTop: 8, paddingBottom: 20 },
  footerText: { fontSize: 12 },

  /* Modal */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalClose: { fontSize: 15, fontWeight: '600' },
  modalScroll: { maxHeight: 400 },

  /* Tag habits list */
  habitRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12, borderBottomWidth: 0.5, borderBottomColor: '#F3F4F6' },
  habitEmoji: { fontSize: 28 },
  habitTitle: { fontSize: 15, fontWeight: '600' },
  habitSub: { fontSize: 12, marginTop: 2 },
  habitStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14 },

  /* Profile edit */
  editLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  iconOption: { width: 50, height: 50, borderRadius: 14, borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  nameInput: { borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 20 },
  saveBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  /* Personality result */
  personalityRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  personalityBadge: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  personalityEmoji: { fontSize: 24 },
  personalityInfo: { flex: 1 },
  personalityLabel: { fontSize: 12, fontWeight: '500', marginBottom: 2 },
  personalityName: { fontSize: 16, fontWeight: '700' },
  personalityTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8, paddingLeft: 60 },
  personalityTagText: { fontSize: 12, fontWeight: '500' },

  /* Tag edit */
  editTagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  editTagChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  editTagCount: { fontSize: 13, textAlign: 'center', marginVertical: 12 },
});
