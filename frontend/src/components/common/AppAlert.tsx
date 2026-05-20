/**
 * 앱 톤 맞춘 커스텀 알림 — React Native의 Alert.alert 대체.
 *
 * 사용법:
 *   import { showAlert } from '../../components/common/AppAlert';
 *   showAlert({ title: '...', message: '...' });
 *   showAlert({
 *     title: '삭제',
 *     message: '복구할 수 없어요',
 *     actions: [
 *       { label: '취소' },
 *       { label: '삭제', destructive: true, onPress: () => doDelete() },
 *     ],
 *   });
 *
 * 루트에서 한 번 <AppAlertHost />를 마운트해야 함.
 */
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

export interface AppAlertAction {
  label: string;
  onPress?: () => void;
  primary?: boolean;
  destructive?: boolean;
}

export interface AppAlertOptions {
  title: string;
  message?: string;
  actions?: AppAlertAction[];   // 기본 [{ label: '확인', primary: true }]
}

// 싱글톤 핸들러 — Host가 마운트되면 등록됨
let handler: ((opts: AppAlertOptions) => void) | null = null;

export function showAlert(opts: AppAlertOptions): void {
  if (handler) {
    handler(opts);
  } else {
    // 핸들러 미등록 시 fallback (앱 부팅 직전 호출 등)
    console.warn('[AppAlert] Host not mounted, alert skipped:', opts.title);
  }
}

export function AppAlertHost() {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const [opts, setOpts] = useState<AppAlertOptions | null>(null);

  useEffect(() => {
    handler = (o) => setOpts(o);
    return () => { handler = null; };
  }, []);

  const close = () => setOpts(null);
  if (!opts) return null;

  const actions: AppAlertAction[] = opts.actions && opts.actions.length > 0
    ? opts.actions
    : [{ label: '확인', primary: true }];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={close}>
      <View style={s.overlay}>
        <View style={[s.card, { backgroundColor: theme.backgroundColor }]}>
          <Text style={[s.title, { color: theme.textPrimary }]}>{opts.title}</Text>
          {!!opts.message && (
            <Text style={[s.message, { color: theme.textSecondary }]}>{opts.message}</Text>
          )}
          <View style={s.btnRow}>
            {actions.map((a, i) => {
              const bg = a.destructive
                ? '#FF3B30'
                : a.primary
                  ? theme.primaryColor
                  : '#F0F1F5';
              const fg = a.destructive || a.primary ? '#FFFFFF' : theme.textPrimary;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => { close(); a.onPress?.(); }}
                  activeOpacity={0.7}
                  style={[s.btn, { backgroundColor: bg }]}
                >
                  <Text style={[s.btnText, { color: fg }]}>{a.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  card: {
    width: '100%', maxWidth: 320,
    borderRadius: 18, padding: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  message: { fontSize: 14, lineHeight: 20, marginBottom: 18 },
  btnRow: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { fontSize: 14, fontWeight: '700' },
});
