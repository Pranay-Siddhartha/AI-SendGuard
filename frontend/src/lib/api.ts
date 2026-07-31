import { AuthResponse, User, AnalysisResult, AnalyticsData, HistoryResponse, Policy, Recipient } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== 'undefined') localStorage.removeItem('token');
    }
    const body = await res.text().catch(() => '');
    throw new Error(body || `API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/* ─── Auth ─── */

export async function authenticate(username: string, password: string): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || 'Authentication failed');
  }
  return res.json();
}

export async function register(
  email: string,
  password: string,
  username: string,
  fullName: string,
  organization?: string
) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username, full_name: fullName, organization }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || 'Registration failed');
  }
  return res.json();
}

export async function getMe(): Promise<User> {
  return fetchWithAuth('/auth/me');
}

/* ─── Analyze ─── */

export async function analyzeFile(
  file: File,
  sender: string,
  recipientEmail: string,
  recipientType: string = 'single'
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sender', sender);
  formData.append('recipient_email', recipientEmail);   // must match backend Form field name
  formData.append('recipient_type', recipientType);

  return fetchWithAuth('/analyze', {
    method: 'POST',
    body: formData,
  });
}

export async function getAnalysis(id: number): Promise<AnalysisResult> {
  return fetchWithAuth(`/analyze/${id}`);
}

/* ─── History ─── */

export async function getHistory(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  risk_level?: string;
  decision?: string;
}): Promise<HistoryResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.per_page) query.set('per_page', String(params.per_page));
  if (params?.search) query.set('search', params.search);
  if (params?.risk_level) query.set('risk_level', params.risk_level);
  if (params?.decision) query.set('decision', params.decision);
  const q = query.toString();
  return fetchWithAuth(`/history${q ? `?${q}` : ''}`);
}

/* ─── Analytics ─── */

export async function getAnalytics(): Promise<AnalyticsData> {
  return fetchWithAuth('/analytics');
}

/* ─── Policies ─── */

export async function getPolicies(): Promise<Policy[]> {
  return fetchWithAuth('/policies');
}

export async function updatePolicy(
  id: number,
  data: { enabled?: boolean; severity?: string }
): Promise<Policy> {
  return fetchWithAuth(`/policies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/* ─── Recipients ─── */

export async function getRecipients(search?: string): Promise<Recipient[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : '';
  return fetchWithAuth(`/recipients${q}`);
}

export async function addRecipient(data: {
  email: string;
  name?: string;
  organization?: string;
  country?: string;
  type?: string;
  trust_level?: string;
}): Promise<Recipient> {
  return fetchWithAuth('/recipients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
