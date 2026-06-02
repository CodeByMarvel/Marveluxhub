const BASE = import.meta.env.VITE_API_URL as string;
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET as string;

let _token: string | null = null;
export function setToken(t: string | null) { _token = t; }

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-admin-secret': ADMIN_SECRET,
  };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data as T;
}

function qs(params: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : '';
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  pending_mechanics: number;
  active_requests: number;
  held_escrow_total_kes: number;
  new_customers_7d: number;
  revenue_7d_kes: number;
  top_mechanics: {
    id: string;
    name: string | null;
    job_count: number;
    rating: number | null;
    level: number;
    mechanic_type: string;
  }[];
}

export interface ApiMechanic {
  id: string;
  mechanic_type: 'mobile' | 'garage' | null;
  level: number | null;
  application_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  rating: number | null;
  job_count: number;
  national_id_url: string | null;
  certificate_url: string | null;
  photo_url: string | null;
  police_clearance_url: string | null;
  created_at: string;
  profiles: { name: string | null; phone: string | null; avatar_url: string | null } | null;
}

export interface ApiCustomer {
  id: string;
  name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  is_banned: boolean;
  banned_reason: string | null;
  banned_at: string | null;
}

// ── F — Dashboard ─────────────────────────────────────────────────────────────
export const getDashboard = () =>
  req<DashboardStats>('GET', '/admin/dashboard');

// ── A — Mechanics ─────────────────────────────────────────────────────────────
export const getMechanics = (p?: { page?: number; limit?: number }) =>
  req<{ data: ApiMechanic[]; total: number }>('GET', `/admin/mechanics${qs(p ?? {})}`);

export const getPendingMechanics = () =>
  req<ApiMechanic[]>('GET', '/admin/mechanics/pending');

export const approveMechanic = (id: string, level = 1) =>
  req('PATCH', `/admin/mechanics/${id}/approve`, { level });

export const rejectMechanic = (id: string, reason?: string) =>
  req('PATCH', `/admin/mechanics/${id}/reject`, reason ? { reason } : undefined);

export const deactivateMechanic = (id: string) =>
  req('DELETE', `/admin/mechanics/${id}`);

// ── B — Customers ─────────────────────────────────────────────────────────────
export const getCustomers = (p?: { page?: number; limit?: number }) =>
  req<{ data: ApiCustomer[]; total: number }>('GET', `/admin/customers${qs(p ?? {})}`);

export const banCustomer = (id: string, reason: string) =>
  req('PATCH', `/admin/customers/${id}/ban`, { reason });

export const unbanCustomer = (id: string) =>
  req('PATCH', `/admin/customers/${id}/unban`);
