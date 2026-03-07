import React, { useCallback } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

interface MoodSliderProps {
  value: number; // -1 to 1
  onValueChange: (value: number) => void;
}

const MOOD_STEPS = [
  { emoji: '😢', label: '많이 힘들었어요', min: -1, max: -0.6 },
  { emoji: '😔', label: '조금 힘들었어요', min: -0.6, max: -0.2 },
  { emoji: '😐', label: '보통이에요', min: -0.2, max: 0.2 },
  { emoji: '🙂', label: '괜찮았어요', min: 0.2, max: 0.6 },
  { emoji: '😊', label: '너무 좋았어요', min: 0.6, max: 1 },
];

function getMoodInfo(value: number) {
  const step = MOOD_STEPS.find((s) => value >= s.min && value <= s.max);
  return step ?? MOOD_STEPS[2]; // default to neutral
}

function getMoodColor(value: number): string {
  if (value <= -0.6) return '#EF4444';
  if (value <= -0.2) return '#F59E0B';
  if (value <= 0.2) return '#9CA3AF';
  if (value <= 0.6) return '#10B981';
  return '#22C55E';
}

const SLIDER_WIDTH = Dimensions.get('window').width - 80; // padding 40 each side
const THUMB_SIZE = 32;

export function MoodSlider({ value, onValueChange }: MoodSliderProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  const moodInfo = getMoodInfo(value);
  const moodColor = getMoodColor(value);

  // Convert -1~1 to 0~1 for positioning
  const normalizedValue = (value + 1) / 2;
  const thumbLeft = normalizedValue * (SLIDER_WIDTH - THUMB_SIZE);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, gestureState) => {
      updateValue(gestureState.x0);
    },
    onPanResponderMove: (_, gestureState) => {
      updateValue(gestureState.moveX);
    },
  });

  const updateValue = useCallback(
    (pageX: number) => {
      const sliderLeft = 40; // padding
      const relative = (pageX - sliderLeft) / SLIDER_WIDTH;
      const clamped = Math.max(0, Math.min(1, relative));
      // Snap to 5 steps: -1, -0.5, 0, 0.5, 1
      const raw = clamped * 2 - 1;
      const snapped = Math.round(raw * 4) / 4; // snap to 0.25 increments
      onValueChange(Math.max(-1, Math.min(1, snapped)));
    },
    [onValueChange],
  );

  return (
    <View style={styles.container}>
      {/* Emoji + Label */}
      <View style={styles.moodDisplay}>
        <Text style={styles.moodEmoji}>{moodInfo.emoji}</Text>
        <Text style={[styles.moodLabel, { color: moodColor }]}>
          {moodInfo.label}
        </Text>
      </View>

      {/* Slider Track */}
      <View style={styles.sliderContainer} {...panResponder.panHandlers}>
        <View style={[styles.track, { backgroundColor: '#F3F4F6' }]}>
          <View
            style={[
              styles.trackFill,
              {
                backgroundColor: moodColor + '40',
                width: `${normalizedValue * 100}%`,
              },
            ]}
          />
        </View>

        {/* Thumb */}
        <View
          style={[
            styles.thumb,
            {
              left: thumbLeft,
              backgroundColor: moodColor,
              shadowColor: moodColor,
            },
          ]}>
          <Text style={styles.thumbEmoji}>{moodInfo.emoji}</Text>
        </View>
      </View>

      {/* Labels */}
      <View style={styles.labelsRow}>
        {MOOD_STEPS.map((step, idx) => (
          <Text
            key={idx}
            style={[styles.stepLabel, { color: theme.textSecondary }]}>
            {step.emoji}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  moodDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  thumbEmoji: {
    fontSize: 16,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 8,
  },
  stepLabel: {
    fontSize: 18,
  },
});
