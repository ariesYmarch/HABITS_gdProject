export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  NameInput: undefined;
  Guide: undefined;
  CurrentPersonalityTest: undefined;
  Transition: undefined;
  IdealPersonalityTest: undefined;
  ResultTagSelection: undefined;
  Occupation: undefined;
  TimetableSetup: undefined;
  HabitRecommendation: undefined;
  Completion: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  DiaryWrite: undefined;
  FeedbackSummary: undefined;
  MyPage: undefined;
  Report: undefined;
  HabitTimer: { habitId: string };
};

// Keep for backwards compatibility
export type MainTabParamList = MainStackParamList;
