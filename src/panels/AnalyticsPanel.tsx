import { tokens } from "../tokens";
import { Card, PageHeader, ScrollArea, StatCard, MiniBar, Sparkline, Donut, Rating, Badge, thStyle, tdStyle } from "../components/ui";

export function AnalyticsPanel() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="Insights" title="ANALYTICS"
        desc="Platform performance · Mar 2026"
        actions={<>
          <select><option>This Month</option><option>Last Month</option><option>Last 90 Days</option></select>
        </>}
      />
      <ScrollArea>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          <StatCard label="Total Bookings"   value="4,921"    delta="↑ +14% vs last month" deltaType="up"   colorVariant="green" />
          <StatCard label="Revenue Est."     value="KES 2.4M" delta="↑ +9% vs last month"  deltaType="up"   colorVariant="green" />
          <StatCard label="Completion Rate"  value="94.2%"    delta="↑ +1.2pp"              deltaType="up"   colorVariant="green" />
          <StatCard label="Avg Rating"       value="4.3★"     delta="↓ -0.1 this month"     deltaType="warn" colorVariant="amber" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
          <Donut pct={94} color={tokens.green} label="Completion Rate"       value="94%" sub="of all bookings completed" />
          <Donut pct={57} color={tokens.amber} label="Mechanic Utilization"  value="57%" sub="avg capacity used" />
          <Donut pct={18} color={tokens.error} label="Complaint Rate"        value="1.8%" sub="of total bookings" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Card title="Bookings by Service" subtitle="Share of total volume">
            <div style={{ padding: "16px 20px" }}>
              <MiniBar label="Oil Change"   pct={78} value="1,843" color={tokens.green} />
              <MiniBar label="Tyre Service" pct={62} value="1,462" color={tokens.green} opacity={0.75} />
              <MiniBar label="Diagnostics"  pct={44} value="1,038" color={tokens.amber} />
              <MiniBar label="Brakes"       pct={35} value="825"   color={tokens.amber} opacity={0.75} />
              <MiniBar label="Electrical"   pct={22} value="519"   color={tokens.text3} />
              <MiniBar label="Other"        pct={14} value="330"   color={tokens.text3} opacity={0.6} />
            </div>
          </Card>
          <Card title="Bookings by Region" subtitle="Geographic distribution">
            <div style={{ padding: "16px 20px" }}>
              <MiniBar label="Nairobi"  pct={88} value="2,176" color={tokens.green} />
              <MiniBar label="Mombasa"  pct={52} value="1,284" color={tokens.green} opacity={0.7} />
              <MiniBar label="Kisumu"   pct={33} value="815"   color={tokens.amber} />
              <MiniBar label="Nakuru"   pct={21} value="518"   color={tokens.amber} opacity={0.7} />
              <MiniBar label="Eldoret"  pct={10} value="247"   color={tokens.text3} />
            </div>
          </Card>
        </div>

        <Card title="Weekly Trend" subtitle="Bookings per day — last 4 weeks">
          <div style={{ padding: "16px 20px" }}>
            <Sparkline data={[145,178,162,201,189,154,90,167,192,178,215,231,198,110,142,188,175,231,218,189,94,155,201,178,209,240,212,130]} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>4 WEEKS AGO</span>
              <span style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>TODAY</span>
            </div>
          </div>
        </Card>

        <Card title="Top Performing Mechanics" subtitle="By jobs completed this month">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Mechanic","Speciality","Jobs","Rating","Earnings Est.","Status"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {[
                  { name: "Amina Oduya",   spec: "Electrical",         jobs: 57,  rating: 4.9, earnings: "KES 114,000", status: "Active" },
                  { name: "Grace Waweru",  spec: "Diagnostics",        jobs: 34,  rating: 4.7, earnings: "KES 68,000",  status: "Active" },
                  { name: "Kiptoo Mwangi", spec: "General Repair",     jobs: 142, rating: 4.1, earnings: "KES 284,000", status: "Under Review" },
                  { name: "David Otieno",  spec: "Tyres & Suspension", jobs: 89,  rating: 3.2, earnings: "KES 178,000", status: "Suspended" },
                ].map(m => (
                  <tr key={m.name}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ ...tdStyle, fontSize: 13, fontWeight: 600, color: tokens.text }}>{m.name}</td>
                    <td style={{ ...tdStyle, fontSize: 12, color: tokens.text2 }}>{m.spec}</td>
                    <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 12, color: tokens.text }}>{m.jobs}</td>
                    <td style={tdStyle}><Rating value={m.rating} /></td>
                    <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 12, color: tokens.green }}>{m.earnings}</td>
                    <td style={tdStyle}>
                      <Badge variant={(m.status === "Active" ? "green" : m.status === "Suspended" ? "red" : "amber") as any}>{m.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </ScrollArea>
    </div>
  );
}
