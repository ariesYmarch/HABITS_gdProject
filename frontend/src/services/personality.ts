import api from './api';

export interface RetestEligibility {
  eligible: boolean;
  reason?: string;
  days_since_last_test?: number;
  recommended_days?: number;
  last?: {
    type_id: number;
    type_name: string;
    hashtags: string[];
    tested_at: string;
  } | null;
}

export interface PersonalityComparison {
  comparable: boolean;
  reason?: string;
  type_changed?: boolean;
  previous?: {
    type_id: number;
    type_name: string;
    hashtags: string[];
    tested_at: string | null;
  };
  latest?: {
    type_id: number;
    type_name: string;
    hashtags: string[];
    tested_at: string | null;
  };
  delta?: {
    added_tags: string[];
    removed_tags: string[];
    kept_tags: string[];
  };
}

export async function checkRetestEligibility(
  testType: 'current' | 'ideal' = 'current',
): Promise<RetestEligibility> {
  const res = await api.get<RetestEligibility>('/api/v1/personality/retest-eligible', {
    params: { test_type: testType },
  });
  return res.data;
}

export async function getPersonalityComparison(
  testType: 'current' | 'ideal' = 'current',
): Promise<PersonalityComparison> {
  const res = await api.get<PersonalityComparison>('/api/v1/personality/comparison', {
    params: { test_type: testType },
  });
  return res.data;
}
