import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { ProgressTab } from '../../components/feedback/ProgressTab';
import { EmotionTab } from '../../components/feedback/EmotionTab';
import { DiaryListTab } from '../../components/feedback/DiaryListTab';

type TabType = 'progress' | 'emotion' | 'diary';
type PeriodType = 'week' | 'month' | 'all';

interface TabInfo {
  key: TabType;
  label: string;
  emoji: string;
}

const TABS: TabInfo[] = [
  { key: 'progress', label: '진행률', emoji: '📊' },
  { key: 'emotion', label: '감정', emoji: '💭' },
  { key: 'diary', label: '일기', emoji: '📔' },
];

interface PeriodInfo {
  key: PeriodType;
  label: string;
}

const PERIODS: PeriodInfo[] = [
  { key: 'week', label: '이번 주' },
  { key: 'month', label: '이번 달' },
  { key: 'all', label: '전체' },
];

function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDateRange(period: PeriodType): { start: string; end: string } {
  const now = new Date();
  const today = formatDateString(now);

  if (period === 'week') {
    // Start of week (Monday)
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diff);
    return {
      start: formatDateString(startOfWeek),
      end: today,
    };
  }

  if (period === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      start: formatDateString(startOfMonth),
      end: today,
    };
  }

  // 'all' - past 365 days
  const yearAgo = new Date(now);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  return {
    start: formatDateString(yearAgo),
    end: today,
  };
}

export function FeedbackSummaryScreen() {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  const [activeTab, setActiveTab] = useState<TabType>('progress');
  const [activePeriod, setActivePeriod] = useState<PeriodType>('week');

  const dateRange = useMemo(() => getDateRange(activePeriod), [activePeriod]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'progress':
        return (
          <ProgressTab startDate={dateRange.start} endDate={dateRange.end} />
        );
      case 'emotion':
        return (
          <EmotionTab startDate={dateRange.start} endDate={dateRange.end} />
        );
      case 'diary':
        return (
          <DiaryListTab startDate={dateRange.start} endDate={dateRange.end} />
        );
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          피드백
        </Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodRow}>
        {PERIODS.map((period) => {
          const isActive = activePeriod === period.key;
          return (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                isActive && {
                  backgroundColor: theme.primaryColor,
                },
              ]}
              onPress={() => setActivePeriod(period.key)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.periodText,
                  {
                    color: isActive ? '#FFFFFF' : theme.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Bar */}
      <View
        style={[
          styles.tabBar,
          { backgroundColor: theme.cardBackgroundColor },
        ]}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                isActive && {
                  borderBottomColor: theme.primaryColor,
                  borderBottomWidth: 2,
                },
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}>
              <Text style={styles.tabEmoji}>{tab.emoji}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? theme.primaryColor : theme.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>{renderTabContent()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  periodRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  periodText: {
    fontSize: 13,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabEmoji: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 14,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
