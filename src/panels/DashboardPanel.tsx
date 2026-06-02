import { useEffect, useState } from "react";
import { tokens } from "../tokens";
import { Btn, Card, PageHeader, ScrollArea, StatCard, MiniBar, Sparkline, Badge, LogItem } from "../components/ui";
import { useToast } from "../components/Toast";
import { getDashboard, type DashboardStats } from "../services/api";

function fmtNum(n: number): string {
  return n.toLocaleString();
}
function fmtKes(n: number): string {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `KES ${(n / 1_000).toFixed(1)}k`;
  return `KES ${n}`;
}

export function DashboardPanel() {
  const toast = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getDashboard()
      .then(setStats)
      .catch((e: Error) => toast(e.message, "danger"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const s = stats;
  const dash = (v: string | number | undefined) =>
    loading ? "…" : v !== undefined ? String(v) : "—";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="Overview" title="DASHBOARD"
        desc={loading ? "Loading…" : "All systems operational"}
        actions={<>
          <Btn onClick={load}>↺ Refresh</Btn>
          <Btn variant="primary" onClick={() => toast("Report exported to your email", "success")}>Export Report</Btn>
        </>}
      />
      <ScrollArea>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14, marginBottom: 24 }}>
          <StatCard
            label="Pending Approvals"
            value={dash(s?.pending_mechanics)}
            delta="mechanics awaiting review"
            deltaType="warn"
            colorVariant="amber"
          />
          <StatCard
            label="Active Jobs"
            value={dash(s?.active_requests)}
            delta="currently in progress"
            deltaType="up"
            colorVariant="green"
          />
          <StatCard
            label="Funds in Escrow"
            value={loading ? "…" : s ? fmtKes(s.held_escrow_total_kes) : "—"}
            delta="currently held"
            deltaType="up"
            colorVariant="green"
          />
          <StatCard
            label="New Customers (7d)"
            value={dash(s?.new_customers_7d)}
            delta="this week"
            deltaType="up"
            colorVariant="green"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Card title="Revenue (7 days)" subtitle="Gross deposits into escrow" actions={<Badge variant="green">Live</Badge>}>
            <div style={{ padding: "16px 20px" }}>
              <Sparkline data={[0, 0, 0, 0, 0, 0, 0]} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                <span style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>MON</span>
                <span style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>SUN</span>
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${tokens.border}` }}>
                <div>
                  <div style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace", letterSpacing: ".8px", marginBottom: 4 }}>7-DAY REVENUE</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 1, color: tokens.green }}>
                    {loading ? "…" : s ? fmtKes(s.revenue_7d_kes) : "—"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace", letterSpacing: ".8px", marginBottom: 4 }}>ESCROW HELD</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 1, color: tokens.text2 }}>
                    {loading ? "…" : s ? fmtKes(s.held_escrow_total_kes) : "—"}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Top Mechanics" subtitle="By completed jobs">
            <div style={{ padding: "16px 20px" }}>
              {loading && (
                <div style={{ color: tokens.text3, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>Loading…</div>
              )}
              {!loading && (!s?.top_mechanics?.length) && (
                <div style={{ color: tokens.text3, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>No data yet</div>
              )}
              {s?.top_mechanics?.map((m, i) => (
                <MiniBar
                  key={m.id}
                  label={m.name ?? `Mechanic ${i + 1}`}
                  pct={s.top_mechanics[0]?.job_count ? Math.round((m.job_count / s.top_mechanics[0].job_count) * 100) : 0}
                  value={`${m.job_count} jobs`}
                  color={i === 0 ? tokens.green : tokens.green}
                  opacity={1 - i * 0.15}
                />
              ))}
            </div>
          </Card>
        </div>

        <Card title="Recent Activity" subtitle="Latest admin actions & system events">
          <div style={{ padding: "8px 20px 16px" }}>
            <LogItem dotColor={tokens.error} tag="FLAG"    tagColor={tokens.error} text="Mechanic <strong>Kiptoo Mwangi</strong> flagged — 3 complaints in 24hrs"    time="12 min ago" />
            <LogItem dotColor={tokens.green} tag="APPROVE" tagColor={tokens.green} text="Mechanic <strong>Amina Oduya</strong> approved and onboarded"                time="1 hr ago" />
            <LogItem dotColor={tokens.amber} tag="FLAG"    tagColor={tokens.amber} text="Customer <strong>James Kariuki</strong> account flagged — suspected fraud"   time="3 hrs ago" />
            <LogItem dotColor={tokens.green} tag="RESOLVE" tagColor={tokens.green} text="Profile edit resolved for <strong>Wanjiku Njoroge</strong>"                  time="5 hrs ago" isLast />
          </div>
        </Card>
      </ScrollArea>
    </div>
  );
}
