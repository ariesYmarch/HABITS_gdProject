import api from './api';

export interface ReportRecommendation {
  kind: 'reduce_frequency' | 'increase_frequency' | 'add_habit' | 'rest' | string;
  label: string;
  message: string;
  habit_id?: string;  // habit의 client_id (프론트 habits 배열 매칭용)
}

export interface ReportItem {
  id: number;
  period_type: 'week' | 'month';
  period_start: string;
  period_end: string;
  completion_rate: number;
  avg_mood: number | null;
  emotion_summary: Record<string, number>;
  insight: string;                            // 한 줄 요약
  diagnosis: string | null;                   // 종합 진단 라벨
  diagnosis_detail: string | null;            // 종합 진단 줄글 (3-4문장)
  diagnosis_keywords: string[];               // 진단 키워드 칩
  full_report: string | null;                 // 줄글 전문
  paragraphs: string[];                       // 문단 리스트
  recommendation: ReportRecommendation | null;
  model_used: string | null;
  generated_at: string | null;
  read_at: string | null;                     // 미열람이면 null (배지 표시용)
}

export async function listReports(period_type?: 'week' | 'month'): Promise<ReportItem[]> {
  const params = period_type ? { period_type } : {};
  const res = await api.get<{ count: number; reports: ReportItem[] }>(
    '/api/v1/reports',
    { params },
  );
  return res.data.reports;
}

export async function getReport(id: number): Promise<ReportItem> {
  const res = await api.get<ReportItem>(`/api/v1/reports/${id}`);
  return res.data;
}

export async function generateReportNow(
  period_type: 'week' | 'month',
  force: boolean = false,
): Promise<{ created: boolean; report?: ReportItem; reason?: string }> {
  const res = await api.post(`/api/v1/reports/generate-now`, null, {
    params: { period_type, force },
  });
  return res.data;
}

export async function deleteReport(id: number): Promise<void> {
  await api.delete(`/api/v1/reports/${id}`);
}

export async function getUnreadCount(): Promise<number> {
  const res = await api.get<{ unread_count: number }>('/api/v1/reports/unread-count');
  return res.data.unread_count;
}

export async function markReportRead(id: number): Promise<void> {
  await api.post(`/api/v1/reports/${id}/mark-read`);
}

export async function rateFeedback(
  period_type: 'weekly' | 'monthly',
  period_start: string,
  period_end: string,
  rating: 'good' | 'neutral' | 'bad',
  source?: string,
  comment?: string,
): Promise<void> {
  await api.post('/api/v1/feedback/rate', {
    period_type,
    period_start,
    period_end,
    rating,
    source,
    comment,
  });
}
