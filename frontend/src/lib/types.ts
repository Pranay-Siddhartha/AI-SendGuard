export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: string;
  organization: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

/* Matches backend AnalysisDetailResponse exactly */
export interface AnalysisResult {
  id: number;
  filename: string;
  file_size: number;
  file_type: string;
  pages: number;
  sender: string;
  recipient_email: string;
  recipient_name: string | null;
  recipient_org: string | null;
  risk_score: number;
  risk_level: string;          // safe | low | medium | high | critical
  decision: string;            // safe_to_send | warn | block | approval_required
  summary: string | null;
  business_context: string | null;
  detected_intent: string | null;
  ai_explanation: string | null;
  ai_confidence: number | null;
  detected_entities: DetectedEntity[] | null;
  sensitive_sections: SensitiveSection[] | null;
  recipient_risk_score: number | null;
  recipient_trust_level: string | null;
  recipient_type: string | null;    // internal | external | unknown
  status: string;
  created_at: string;
}

export interface DetectedEntity {
  type: string;
  value: string;
  score: number;
  start: number;
  end: number;
}

export interface SensitiveSection {
  text: string;
  reason: string;
  severity: string;
}

/* Backend analytics response */
export interface AnalyticsData {
  total_analyses: number;
  high_risk_count: number;
  blocked_count: number;
  safe_count: number;
  avg_risk_score: number;
  risk_distribution: Record<string, number>;   // { safe: 3, low: 2, medium: 1, ... }
  entity_type_counts: { type: string; count: number }[];
}

/* History paginated response */
export interface HistoryResponse {
  items: AnalysisResult[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/* Backend PolicyResponse */
export interface Policy {
  id: number;
  name: string;
  category: string;
  description: string;
  enabled: boolean;
  severity: string;
  created_at: string;
  updated_at: string;
}

/* Backend RecipientResponse */
export interface Recipient {
  id: number;
  email: string;
  name: string | null;
  organization: string | null;
  country: string | null;
  type: string;           // internal | external | unknown
  trust_level: string;    // trusted | neutral | untrusted
  risk_score: number;
  communication_count: number;
  last_communication: string | null;
  created_at: string;
}
