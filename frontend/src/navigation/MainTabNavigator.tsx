import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { HomeScreen } from '../screens/home/HomeScreen';
import { DiaryWriteScreen } from '../screens/diary/DiaryWriteScreen';
import { FeedbackSummaryScreen } from '../screens/feedback/FeedbackSummaryScreen';
import { MyPageScreen } from '../screens/mypage/MyPageScreen';
import { ReportScreen } from '../screens/report/ReportScreen';
import { HabitTimerScreen } from '../screens/home/HabitTimerScreen';
import { useAppStore } from '../store';
import { themes } from '../theme/themes';

const Stack = createNativeStackNavigator<MainStackParamList>();

/**
 * MainNavigator — Swift NavigationStack + .sheet() + .navigationDestination() 재현
 *
 * - Home: 자체 헤더 사용 (headerShown: false)
 * - DiaryWrite: iOS modal (.sheet) + 인라인 타이틀 "오늘의 일기" + "취소" 버튼
 * - FeedbackSummary: iOS modal (.sheet) + 인라인 타이틀 "피드백" + "완료" 버튼
 * - MyPage: 푸시 네비게이션 + 인라인 타이틀 "마이페이지" + 뒤로가기
 */
export function MainTabNavigator() {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.backgroundColor,
        },
        headerTintColor: theme.primaryColor,
        headerTitleStyle: {
          fontSize: 17,
          fontWeight: '600',
          color: theme.textPrimary,
        },
        contentStyle: {
          backgroundColor: theme.backgroundColor,
        },
      }}>
      {/* Home — 자체 헤더, 네비게이터 헤더 숨김 */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      {/* DiaryWrite — Swift .sheet() 모달 재현 */}
      <Stack.Screen
        name="DiaryWrite"
        component={DiaryWriteScreen}
        options={({ navigation }) => ({
          presentation: 'modal',
          title: '오늘의 일기',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.headerTextButton, { color: theme.primaryColor }]}>
                취소
              </Text>
            </TouchableOpacity>
          ),
        })}
      />

      {/* FeedbackSummary — Swift .sheet() 모달 재현 */}
      <Stack.Screen
        name="FeedbackSummary"
        component={FeedbackSummaryScreen}
        options={({ navigation }) => ({
          presentation: 'modal',
          title: '피드백',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.headerTextButton, { color: theme.primaryColor }]}>
                완료
              </Text>
            </TouchableOpacity>
          ),
        })}
      />

      {/* MyPage — Swift .navigationDestination() 푸시 재현 */}
      <Stack.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          title: '마이페이지',
        }}
      />

      {/* Report — 피드백 리포트 보관 */}
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: '피드백 리포트',
          headerBackTitle: '',                       // iOS 'Home' 텍스트 제거
          headerBackButtonDisplayMode: 'minimal',    // RN Native Stack v7: '<' 만 노출
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: '700',
            color: theme.textPrimary,
          },
        }}
      />

      {/* HabitTimer — 풀스크린 타이머 (헤더 숨김) */}
      <Stack.Screen
        name="HabitTimer"
        component={HabitTimerScreen}
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTextButton: {
    fontSize: 17,
    fontWeight: '400',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
