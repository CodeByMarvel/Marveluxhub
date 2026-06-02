import { tokens } from "../tokens";
import { Btn, Card, PageHeader, ScrollArea, StatCard, MiniBar, Sparkline, Badge, LogItem } from "../components/ui";
import { useToast } from "../components/Toast";

export function DashboardPanel() {
  const toast = useToast();

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="Overview" title="DASHBOARD"
        desc="Mar 20, 2026 · All systems operational"
        actions={<>
          <Btn onClick={() => toast("Refreshing data…", "info")}>↺ Refresh</Btn>
          <Btn variant="primary" onClick={() => toast("Report exported to your email", "success")}>Export Report</Btn>
        </>}
      />
      <ScrollArea>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14, marginBottom: 24 }}>
          <StatCard label="Total Users"       value="3,842" delta="↑ +124 this week"     deltaType="up"   colorVariant="green" />
          <StatCard label="Active Mechanics"  value="218"   delta="↑ +12 this month"     deltaType="up"   colorVariant="green" />
          <StatCard label="Open Complaints"   value="4"     delta="↑ +2 since yesterday" deltaType="down" colorVariant="red" />
          <StatCard label="Avg Response Time" value="18m"   delta="↓ Slower than target" deltaType="warn" colorVariant="amber" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Card title="Weekly Bookings" subtitle="Mon → Sun this week" actions={<Badge variant="green">Live</Badge>}>
            <div style={{ padding: "16px 20px" }}>
              <Sparkline data={[142, 198, 175, 231, 218, 189, 94]} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                <span style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>MON</span>
                <span style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>SUN</span>
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${tokens.border}` }}>
                {[
                  ["THIS WEEK", "1,247", tokens.green],
                  ["LAST WEEK", "1,094", tokens.text2],
                ].map(([lbl, val, col]) => (
                  <div key={lbl}>
                    <div style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace", letterSpacing: ".8px", marginBottom: 4 }}>{lbl}</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 1, color: col }}>{val}</div>
                  </div>
                ))}
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace", letterSpacing: ".8px", marginBottom: 4 }}>GROWTH</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 1, color: tokens.green }}>+14%</div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Service Categories" subtitle="Top booking types">
            <div style={{ padding: "16px 20px" }}>
              <MiniBar label="Oil Change"   pct={78} value="78%" color={tokens.green} />
              <MiniBar label="Tyre Service" pct={62} value="62%" color={tokens.green} opacity={0.7} />
              <MiniBar label="Diagnostics"  pct={44} value="44%" color={tokens.amber} />
              <MiniBar label="Brakes"       pct={35} value="35%" color={tokens.amber} opacity={0.7} />
              <MiniBar label="Electrical"   pct={22} value="22%" color={tokens.text3} />
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
