import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert,
} from 'react-native';
import {
  RetestEligibility, PersonalityComparison,
  checkRetestEligibility, getPersonalityComparison,
} from '../../services/personality';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

interface Props {
  onRequestRetest?: () => void;
}

export function PersonalityRetestCard({ onRequestRetest }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  const [eligibility, setEligibility] = useState<RetestEligibility | null>(null);
  const [comparison, setComparison] = useState<PersonalityComparison | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const elig = await checkRetestEligibility('current');
        setEligibility(elig);
        const comp = await getPersonalityComparison('current');
        setComparison(comp);
      } catch {
        // 조용히 무시 (서버 미연결 등)
      }
    })();
  }, []);

  if (!eligibility) return null;

  const handleRetest = () => {
    if (onRequestRetest) {
      onRequestRetest();
    } else {
      Alert.alert('재검사', '온보딩 화면에서 다시 진행해주세요. (전용 재검사 흐름은 다음 업데이트에 포함됩니다)');
    }
  };

  return (
    <View style={[s.card, { backgroundColor: theme.primaryColor + '0A' }]}>
      <Text style={[s.title, { color: theme.textPrimary }]}>성격 유형 재검사</Text>
      <Text style={[s.message, { color: theme.textSecondary }]}>
        {eligibility.reason}
      </Text>

      <View style={s.btnRow}>
        {eligibility.eligible && (
          <TouchableOpacity
            style={[s.btn, { backgroundColor: theme.primaryColor }]}
            onPress={handleRetest}
          >
            <Text style={s.btnText}>재검사하기</Text>
          </TouchableOpacity>
        )}
        {comparison?.comparable && (
          <TouchableOpacity
            style={[s.btn, { backgroundColor: theme.primaryColor + '1A' }]}
            onPress={() => setShowComparison(true)}
          >
            <Text style={[s.btnText, { color: theme.primaryColor }]}>변화 비교</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={showComparison} transparent animationType="slide" onRequestClose={() => setShowComparison(false)}>
        <View style={s.overlay}>
          <View style={[s.modal, { backgroundColor: theme.backgroundColor }]}>
            <View style={s.modalHeader}>
              <Text style={[s.modalTitle, { color: theme.textPrimary }]}>성격 변화</Text>
              <TouchableOpacity onPress={() => setShowComparison(false)}>
                <Text style={{ fontSize: 20, color: theme.textSecondary }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              {comparison && comparison.comparable ? (
                <>
                  <View style={s.compareRow}>
                    <View style={[s.compareCol, { backgroundColor: '#F5F6FA' }]}>
                      <Text style={[s.compareLabel, { color: theme.textSecondary }]}>이전</Text>
                      <Text style={[s.compareName, { color: theme.textPrimary }]}>
                        {comparison.previous?.type_name || '-'}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 24, color: theme.textSecondary }}>→</Text>
                    <View style={[s.compareCol, { backgroundColor: theme.primaryColor + '1A' }]}>
                      <Text style={[s.compareLabel, { color: theme.textSecondary }]}>지금</Text>
                      <Text style={[s.compareName, { color: theme.primaryColor }]}>
                        {comparison.latest?.type_name || '-'}
                      </Text>
                    </View>
                  </View>

                  {comparison.type_changed && (
                    <Text style={[s.changeMsg, { color: theme.primaryColor }]}>
                      유형이 변화했어요!
                    </Text>
                  )}

                  <View style={s.deltaSection}>
                    {(comparison.delta?.added_tags || []).length > 0 && (
                      <View style={s.deltaBlock}>
                        <Text style={[s.deltaTitle, { color: theme.textPrimary }]}>+ 새로 추가된 특성</Text>
                        <View style={s.tagWrap}>
                          {comparison.delta?.added_tags.map((t) => (
                            <Text key={t} style={[s.tag, { backgroundColor: '#2ECC711A', color: '#2ECC71' }]}>{t}</Text>
                          ))}
                        </View>
                      </View>
                    )}
                    {(comparison.delta?.removed_tags || []).length > 0 && (
                      <View style={s.deltaBlock}>
                        <Text style={[s.deltaTitle, { color: theme.textPrimary }]}>- 사라진 특성</Text>
                        <View style={s.tagWrap}>
                          {comparison.delta?.removed_tags.map((t) => (
                            <Text key={t} style={[s.tag, { backgroundColor: '#E74C3C1A', color: '#E74C3C' }]}>{t}</Text>
                          ))}
                        </View>
                      </View>
                    )}
                    {(comparison.delta?.kept_tags || []).length > 0 && (
                      <View style={s.deltaBlock}>
                        <Text style={[s.deltaTitle, { color: theme.textPrimary }]}>유지된 특성</Text>
                        <View style={s.tagWrap}>
                          {comparison.delta?.kept_tags.map((t) => (
                            <Text key={t} style={[s.tag, { backgroundColor: '#F5F6FA', color: theme.textSecondary }]}>{t}</Text>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </>
              ) : (
                <Text style={{ color: theme.textSecondary, padding: 16 }}>
                  {comparison?.reason || '비교 데이터 없음'}
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  card: { padding: 14, borderRadius: 10, marginBottom: 12 },
  title: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  message: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  btnRow: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: {
    paddingTop: 24, paddingHorizontal: 20, paddingBottom: 20,
    borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700' },
  compareRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  compareCol: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  compareLabel: { fontSize: 11, marginBottom: 4 },
  compareName: { fontSize: 15, fontWeight: '700' },
  changeMsg: { textAlign: 'center', fontSize: 13, fontWeight: '600', marginBottom: 16 },
  deltaSection: { gap: 16 },
  deltaBlock: {},
  deltaTitle: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontWeight: '600',
  },
});
